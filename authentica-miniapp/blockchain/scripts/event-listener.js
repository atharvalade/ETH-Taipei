/**
 * Event Listener for World Chain Payment Verifier Contract
 * 
 * This script listens for events from the World Chain contract and forwards them to
 * the Authentica API webhook. It should be run as a separate process in production.
 */

const ethers = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Configuration (from environment variables)
const WORLD_CHAIN_RPC_URL = process.env.WORLD_CHAIN_RPC_URL || "https://testnet-rpc.worldchain.cool";
const WORLD_CHAIN_CONTRACT_ADDRESS = process.env.WORLD_CHAIN_CONTRACT_ADDRESS;
const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://authentica-api.vercel.app/api/hyperlane/payment-webhook";
const WEBHOOK_API_KEY = process.env.HYPERLANE_WEBHOOK_API_KEY;

// ABI for the World Chain contract events we want to listen for
const contractABI = [
  "event PaymentVerified(bytes32 indexed paymentId, address indexed userAddress, uint256 amount, uint256 timestamp)",
  "event ServiceExecuted(bytes32 indexed paymentId, address indexed userAddress)"
];

// Initialize provider and contract
const provider = new ethers.providers.JsonRpcProvider(WORLD_CHAIN_RPC_URL);
const contract = new ethers.Contract(WORLD_CHAIN_CONTRACT_ADDRESS, contractABI, provider);

// Start listening for events
async function startEventListener() {
  console.log(`🔎 Starting event listener for contract ${WORLD_CHAIN_CONTRACT_ADDRESS}`);
  console.log(`🔗 Connected to RPC URL: ${WORLD_CHAIN_RPC_URL}`);
  
  // Listen for PaymentVerified events
  contract.on("PaymentVerified", async (paymentId, userAddress, amount, timestamp, event) => {
    console.log(`📣 PaymentVerified event detected:`);
    console.log(`  Payment ID: ${paymentId}`);
    console.log(`  User Address: ${userAddress}`);
    console.log(`  Amount: ${ethers.utils.formatEther(amount)} ETH`);
    console.log(`  Timestamp: ${new Date(timestamp.toNumber() * 1000).toISOString()}`);
    console.log(`  Transaction Hash: ${event.transactionHash}`);
    
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
  
  // Listen for ServiceExecuted events
  contract.on("ServiceExecuted", async (paymentId, userAddress, event) => {
    console.log(`📣 ServiceExecuted event detected:`);
    console.log(`  Payment ID: ${paymentId}`);
    console.log(`  User Address: ${userAddress}`);
    console.log(`  Transaction Hash: ${event.transactionHash}`);
    
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
  
  console.log("✅ Event listener started successfully");
  console.log("🔍 Waiting for events...");
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
  contract.removeAllListeners();
  console.log('👋 Event listener stopped');
  process.exit(0);
}

// Listen for shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown); 