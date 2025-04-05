/**
 * Test script for the Rootstock payment flow
 * 
 * This script tests direct payments to the payment wallet for verification.
 * It requires a wallet with RSK testnet funds.
 * 
 * To run:
 * node test-rootstock-payment.js
 */

const { ethers } = require('ethers');
require('dotenv').config();

// Configuration
const PAYMENT_WALLET_ADDRESS = "0xa20C96EA7B9AbAe32217EbA25577cDe099039D5D";
const ROOTSTOCK_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY || "bd1d533ee99db437945e4b233c94e087ef8c59d78301abf5b3102b6e1fabf3f2";
const RPC_URL = process.env.ROOTSTOCK_RPC_URL || "https://public-node.testnet.rsk.co";

// ABI for the contract if we're using it
const CONTRACT_ABI = [
  "function payForVerification(address _userAddress, bytes32 _referenceId) external payable",
  "event PaymentReceived(address indexed sender, uint256 amount, bytes32 paymentId)",
  "event MessageSent(address indexed sender, bytes32 paymentId, uint32 destinationDomain, bytes32 messageId)",
  "event FallbackProcessActivated(bytes32 paymentId, address userAddress, string reason)"
];

async function main() {
  try {
    console.log("🧪 Testing Rootstock payment flow...");

    // Connect to Rootstock testnet
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log(`🔑 Connected with wallet: ${wallet.address}`);
    console.log(`💼 Payment wallet address: ${PAYMENT_WALLET_ADDRESS}`);

    // Get wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Wallet balance: ${ethers.utils.formatEther(balance)} rBTC`);

    const paymentAmount = ethers.utils.parseEther("0.00001");
    if (balance.lt(paymentAmount.mul(2))) {
      console.warn("⚠️ Wallet balance may be too low. The test requires at least 0.00002 rBTC for payment and gas.");
    }

    // Generate a test reference ID
    const testReferenceId = `test-${Date.now()}`;
    const referenceIdBytes32 = ethers.utils.formatBytes32String(testReferenceId);
    console.log(`🆔 Reference ID: ${testReferenceId}`);

    // Ask the user which method to use
    const useContract = ROOTSTOCK_CONTRACT_ADDRESS && process.argv.includes("--use-contract");
    
    if (useContract) {
      console.log("✅ Using smart contract for payment");
      await payWithContract(wallet, provider, referenceIdBytes32);
    } else {
      console.log("✅ Using direct wallet transfer");
      await payDirectly(wallet, provider);
    }

    console.log("✅ Test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Function to pay via the smart contract
async function payWithContract(wallet, provider, referenceIdBytes32) {
  if (!ROOTSTOCK_CONTRACT_ADDRESS) {
    throw new Error("Missing NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS in .env file");
  }

  console.log(`🎯 Target contract: ${ROOTSTOCK_CONTRACT_ADDRESS}`);
  const contract = new ethers.Contract(ROOTSTOCK_CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

  // Call the contract function
  console.log("📤 Sending transaction...");
  const tx = await contract.payForVerification(
    wallet.address, // Using the sender address as the user address
    referenceIdBytes32,
    {
      value: ethers.utils.parseEther("0.00001"), // 0.00001 rBTC
      gasLimit: 500000 // Adjust as needed
    }
  );

  console.log(`🔄 Transaction sent: ${tx.hash}`);
  console.log("⏳ Waiting for confirmation...");

  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

  // Parse event logs from the receipt
  console.log("📝 Checking for events...");
  
  // Look for PaymentReceived event
  const paymentReceivedEvents = receipt.events.filter(event => 
    event.topics[0] === ethers.utils.id("PaymentReceived(address,uint256,bytes32)")
  );
  
  if (paymentReceivedEvents.length > 0) {
    const paymentEvent = paymentReceivedEvents[0];
    const paymentId = paymentEvent.topics[3];
    console.log(`🔑 Payment ID: ${paymentId}`);
  }
  
  // Look for FallbackProcessActivated event
  const fallbackEvents = receipt.events.filter(event => 
    event.topics[0] === ethers.utils.id("FallbackProcessActivated(bytes32,address,string)")
  );
  
  if (fallbackEvents.length > 0) {
    console.log(`📱 Fallback process activated. Check the event listener for verification.`);
  }
}

// Function to pay directly to the wallet
async function payDirectly(wallet, provider) {
  // Create a simple transaction to send rBTC directly to the payment wallet
  console.log("📤 Sending direct payment...");
  
  const tx = await wallet.sendTransaction({
    to: PAYMENT_WALLET_ADDRESS,
    value: ethers.utils.parseEther("0.00001"), // 0.00001 rBTC
    gasLimit: 21000 // Standard gas limit for a simple transfer
  });

  console.log(`🔄 Transaction sent: ${tx.hash}`);
  console.log("⏳ Waiting for confirmation...");

  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`🔗 Rootstock TX Explorer: https://explorer.testnet.rsk.co/tx/${tx.hash}`);
  
  console.log(`📱 Direct payment completed. The event listener should detect this payment`);
  console.log(`📱 and trigger the fallback verification process.`);
}

// Run the test
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Unhandled error:", error);
    process.exit(1);
  }); 