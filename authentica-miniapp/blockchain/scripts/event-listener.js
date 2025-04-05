/**
 * Event Listener for World Chain Payment Verifier Contract
 * 
 * This script listens for events from the World Chain contract and forwards them to
 * the Authentica API webhook. It also monitors Rootstock transactions for fallback verification.
 */

const ethers = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Configuration (from environment variables)
const WORLD_CHAIN_RPC_URL = process.env.WORLD_CHAIN_RPC_URL || "https://testnet-rpc.worldchain.cool";
const ROOTSTOCK_RPC_URL = process.env.ROOTSTOCK_RPC_URL || "https://public-node.testnet.rsk.co";
const WORLD_CHAIN_CONTRACT_ADDRESS = process.env.WORLD_CHAIN_CONTRACT_ADDRESS;
const ROOTSTOCK_CONTRACT_ADDRESS = process.env.ROOTSTOCK_CONTRACT_ADDRESS;
const PAYMENT_WALLET_ADDRESS = process.env.PAYMENT_WALLET_ADDRESS || "0xa20C96EA7B9AbAe32217EbA25577cDe099039D5D";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://authentica-api.vercel.app/api/hyperlane/payment-webhook";
const WEBHOOK_API_KEY = process.env.HYPERLANE_WEBHOOK_API_KEY;
const PAYMENT_STATUS_URL = process.env.PAYMENT_STATUS_URL || "https://authentica-api.vercel.app/api/payment-status";
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

// ABI for the World Chain contract events we want to listen for
const worldContractABI = [
  "event PaymentVerified(bytes32 indexed paymentId, address indexed userAddress, uint256 amount, uint256 timestamp)",
  "event ServiceExecuted(bytes32 indexed paymentId, address indexed userAddress)",
  "event FallbackVerification(bytes32 indexed paymentId, address indexed userAddress, string txHash)",
  "function fallbackVerify(bytes32 _paymentId, address _userAddress, string calldata _txHash) external"
];

// ABI for the Rootstock contract events
const rootstockContractABI = [
  "event PaymentReceived(address indexed sender, uint256 amount, bytes32 paymentId)",
  "event MessageSent(address indexed sender, bytes32 paymentId, uint32 destinationDomain, bytes32 messageId)",
  "event FallbackProcessActivated(bytes32 paymentId, address userAddress, string reason)"
];

// ABI for checking payments to the wallet
const walletABI = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];

// Initialize providers and contracts
const worldProvider = new ethers.providers.JsonRpcProvider(WORLD_CHAIN_RPC_URL);
const rootstockProvider = new ethers.providers.JsonRpcProvider(ROOTSTOCK_RPC_URL);
const worldContract = new ethers.Contract(WORLD_CHAIN_CONTRACT_ADDRESS, worldContractABI, worldProvider);
const rootstockContract = ROOTSTOCK_CONTRACT_ADDRESS ? 
  new ethers.Contract(ROOTSTOCK_CONTRACT_ADDRESS, rootstockContractABI, rootstockProvider) : null;

// Admin wallet for triggering fallback verification
let adminWallet = null;
if (ADMIN_PRIVATE_KEY) {
  adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, worldProvider);
  console.log(`Admin wallet configured: ${adminWallet.address}`);
}

// Track pending payments for fallback verification
const pendingPayments = new Map();

// Start listening for events
async function startEventListener() {
  console.log(`🔎 Starting event listener for World Chain contract: ${WORLD_CHAIN_CONTRACT_ADDRESS}`);
  console.log(`🔗 Connected to World Chain RPC URL: ${WORLD_CHAIN_RPC_URL}`);
  
  if (ROOTSTOCK_CONTRACT_ADDRESS) {
    console.log(`🔗 Connected to Rootstock RPC URL: ${ROOTSTOCK_RPC_URL}`);
    console.log(`📄 Monitoring Rootstock contract: ${ROOTSTOCK_CONTRACT_ADDRESS}`);
  }
  
  console.log(`💰 Monitoring payments to wallet: ${PAYMENT_WALLET_ADDRESS}`);
  
  // Listen for PaymentVerified events on World Chain
  worldContract.on("PaymentVerified", async (paymentId, userAddress, amount, timestamp, event) => {
    console.log(`📣 PaymentVerified event detected:`);
    console.log(`  Payment ID: ${paymentId}`);
    console.log(`  User Address: ${userAddress}`);
    console.log(`  Amount: ${ethers.utils.formatEther(amount)} ETH`);
    console.log(`  Timestamp: ${new Date(timestamp.toNumber() * 1000).toISOString()}`);
    console.log(`  Transaction Hash: ${event.transactionHash}`);
    
    // Update payment status
    await updatePaymentStatus(paymentId.toString(), event.transactionHash);
    
    // Forward event to webhook
    await forwardEventToWebhook({
      event: "PaymentVerified",
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      args: {
        paymentId,
        userAddress,
        amount: amount.toString(),
        timestamp: timestamp.toString()
      }
    });
  });
  
  // Listen for ServiceExecuted events on World Chain
  worldContract.on("ServiceExecuted", async (paymentId, userAddress, event) => {
    console.log(`📣 ServiceExecuted event detected:`);
    console.log(`  Payment ID: ${paymentId}`);
    console.log(`  User Address: ${userAddress}`);
    console.log(`  Transaction Hash: ${event.transactionHash}`);
    
    // Remove from pending payments if present
    pendingPayments.delete(paymentId);
    
    // Forward event to webhook
    await forwardEventToWebhook({
      event: "ServiceExecuted",
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      args: {
        paymentId,
        userAddress
      }
    });
  });
  
  // Listen for FallbackVerification events on World Chain
  worldContract.on("FallbackVerification", async (paymentId, userAddress, txHash, event) => {
    console.log(`📣 FallbackVerification event detected:`);
    console.log(`  Payment ID: ${paymentId}`);
    console.log(`  User Address: ${userAddress}`);
    console.log(`  Original TX Hash: ${txHash}`);
    console.log(`  Verification TX Hash: ${event.transactionHash}`);
    
    // Update payment status
    await updatePaymentStatus(paymentId.toString(), txHash);
    
    // Forward event to webhook
    await forwardEventToWebhook({
      event: "FallbackVerification",
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      args: {
        paymentId,
        userAddress,
        originalTxHash: txHash
      }
    });
  });
  
  // Listen for Rootstock contract events if available
  if (rootstockContract) {
    // Listen for PaymentReceived events
    rootstockContract.on("PaymentReceived", async (sender, amount, paymentId, event) => {
      console.log(`📣 Rootstock PaymentReceived event detected:`);
      console.log(`  Sender: ${sender}`);
      console.log(`  Amount: ${ethers.utils.formatEther(amount)} rBTC`);
      console.log(`  Payment ID: ${paymentId}`);
      console.log(`  Transaction Hash: ${event.transactionHash}`);
      
      // Track this payment for potential fallback verification
      pendingPayments.set(paymentId, {
        paymentId,
        userAddress: sender, // This will need to be adjusted based on your actual payload
        txHash: event.transactionHash,
        timestamp: Math.floor(Date.now() / 1000)
      });
    });
    
    // Listen for FallbackProcessActivated events
    rootstockContract.on("FallbackProcessActivated", async (paymentId, userAddress, reason, event) => {
      console.log(`📣 Rootstock FallbackProcessActivated event detected:`);
      console.log(`  Payment ID: ${paymentId}`);
      console.log(`  User Address: ${userAddress}`);
      console.log(`  Reason: ${reason}`);
      console.log(`  Transaction Hash: ${event.transactionHash}`);
      
      // Trigger fallback verification if admin wallet is configured
      if (adminWallet) {
        console.log(`🔄 Triggering fallback verification for payment ID: ${paymentId}`);
        await triggerFallbackVerification(paymentId, userAddress, event.transactionHash);
      } else {
        console.log(`⚠️ Admin wallet not configured. Cannot trigger fallback verification automatically.`);
      }
    });
  }
  
  // Monitor direct payments to the payment wallet
  rootstockProvider.on({
    address: PAYMENT_WALLET_ADDRESS,
    topics: [ethers.utils.id("Transfer(address,address,uint256)")]
  }, async (log) => {
    console.log(`💰 Payment detected to wallet: ${PAYMENT_WALLET_ADDRESS}`);
    console.log(`  Transaction Hash: ${log.transactionHash}`);
    
    // Fetch transaction details
    const tx = await rootstockProvider.getTransaction(log.transactionHash);
    console.log(`  From: ${tx.from}`);
    console.log(`  Value: ${ethers.utils.formatEther(tx.value)} rBTC`);
    
    // Check if this is a payment of the expected amount
    const expectedAmount = ethers.utils.parseEther("0.00001");
    if (tx.value.eq(expectedAmount)) {
      console.log(`✅ Valid payment amount detected!`);
      
      // Generate a payment ID (this should match how your contract does it)
      const paymentId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["address", "uint256", "uint256"],
          [tx.from, tx.value.toString(), tx.timestamp || Math.floor(Date.now() / 1000)]
        )
      );
      
      // Track for potential fallback verification
      pendingPayments.set(paymentId, {
        paymentId,
        userAddress: tx.from,
        txHash: tx.hash,
        timestamp: Math.floor(Date.now() / 1000)
      });
      
      // If this is a direct payment without contract interaction, trigger fallback immediately
      if (adminWallet && tx.to === PAYMENT_WALLET_ADDRESS) {
        console.log(`🔄 Direct payment detected. Triggering fallback verification.`);
        await triggerFallbackVerification(paymentId, tx.from, tx.hash);
      }
    }
  });
  
  // Set up a periodic check for pending payments that might need fallback verification
  setInterval(checkPendingPayments, 60000); // Check every minute
  
  console.log("✅ Event listener started successfully");
  console.log("🔍 Waiting for events...");
}

// Function to check pending payments and trigger fallback if needed
async function checkPendingPayments() {
  console.log(`🔍 Checking pending payments: ${pendingPayments.size} payments pending`);
  
  const now = Math.floor(Date.now() / 1000);
  const timeoutThreshold = 10 * 60; // 10 minutes
  
  for (const [paymentId, payment] of pendingPayments.entries()) {
    // If payment has been pending for more than the threshold
    if (now - payment.timestamp > timeoutThreshold) {
      console.log(`⏰ Payment ${paymentId} has been pending for more than ${timeoutThreshold} seconds`);
      
      if (adminWallet) {
        console.log(`🔄 Triggering fallback verification for timed-out payment`);
        await triggerFallbackVerification(payment.paymentId, payment.userAddress, payment.txHash);
        
        // Remove from pending map
        pendingPayments.delete(paymentId);
      }
    }
  }
}

// Function to trigger fallback verification on World Chain
async function triggerFallbackVerification(paymentId, userAddress, txHash) {
  if (!adminWallet) {
    console.error('❌ Cannot trigger fallback verification: admin wallet not configured');
    return;
  }
  
  try {
    console.log(`🔄 Triggering fallback verification:`);
    console.log(`  Payment ID: ${paymentId}`);
    console.log(`  User Address: ${userAddress}`);
    console.log(`  Original TX Hash: ${txHash}`);
    
    const worldContractWithSigner = worldContract.connect(adminWallet);
    
    const tx = await worldContractWithSigner.fallbackVerify(
      paymentId, 
      userAddress,
      txHash,
      { gasLimit: 300000 }
    );
    
    console.log(`🔄 Fallback verification transaction sent: ${tx.hash}`);
    console.log(`⏳ Waiting for confirmation...`);
    
    const receipt = await tx.wait();
    console.log(`✅ Fallback verification confirmed in block ${receipt.blockNumber}`);
  } catch (error) {
    console.error('❌ Error triggering fallback verification:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Function to update payment status via API
async function updatePaymentStatus(paymentId, txHash) {
  try {
    // In a real implementation, we would also need to match reference IDs to payment IDs
    // For simplicity, we're assuming payment ID can be used as reference ID
    const referenceId = paymentId;
    
    console.log(`🔄 Updating payment status for reference ID: ${referenceId}`);
    
    const response = await axios.post(`${PAYMENT_STATUS_URL}/update`, {
      referenceId,
      txHash,
      status: 'completed'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_API_KEY}`
      }
    });
    
    if (response.status === 200) {
      console.log(`✅ Successfully updated payment status for ${referenceId}`);
    } else {
      console.error(`❌ Failed to update payment status: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error updating payment status:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Function to forward events to the API webhook
async function forwardEventToWebhook(eventData) {
  try {
    console.log(`🚀 Forwarding event to webhook: ${WEBHOOK_URL}`);
    
    const response = await axios.post(WEBHOOK_URL, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_API_KEY}`
      }
    });
    
    if (response.status === 200) {
      console.log(`✅ Successfully forwarded event: ${response.data.message}`);
    } else {
      console.error(`❌ Failed to forward event: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error forwarding event to webhook:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Start the listener
startEventListener().catch(console.error);

// Function to gracefully shut down
function shutdown() {
  console.log('📴 Shutting down event listener...');
  // Remove all listeners
  worldContract.removeAllListeners();
  if (rootstockContract) {
    rootstockContract.removeAllListeners();
  }
  rootstockProvider.removeAllListeners();
  console.log('👋 Event listener stopped');
  process.exit(0);
}

// Listen for shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown); 