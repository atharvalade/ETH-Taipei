/**
 * Test script for the Rootstock payment flow
 * 
 * This script tests the interaction with the Rootstock smart contract
 * for making payments. It requires a wallet with RSK testnet funds.
 * 
 * To run:
 * node test-rootstock-payment.js
 */

const { ethers } = require('ethers');
require('dotenv').config();

// Configuration
const ROOTSTOCK_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.ROOTSTOCK_RPC_URL || "https://public-node.testnet.rsk.co";

// ABI for the payForVerification function
const ABI = [
  "function payForVerification(address _userAddress, bytes32 _referenceId) external payable",
  "event PaymentReceived(address indexed sender, uint256 amount, bytes32 paymentId)",
  "event MessageSent(address indexed sender, bytes32 paymentId, uint32 destinationDomain, bytes32 messageId)"
];

async function main() {
  try {
    console.log("🧪 Testing Rootstock payment flow with Hyperlane...");

    // Check for required environment variables
    if (!ROOTSTOCK_CONTRACT_ADDRESS) {
      throw new Error("Missing NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS in .env file");
    }
    
    if (!PRIVATE_KEY) {
      throw new Error("Missing PRIVATE_KEY in .env file");
    }

    // Connect to Rootstock testnet
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(ROOTSTOCK_CONTRACT_ADDRESS, ABI, wallet);

    console.log(`🔑 Connected with wallet: ${wallet.address}`);
    console.log(`🎯 Target contract: ${ROOTSTOCK_CONTRACT_ADDRESS}`);

    // Get wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Wallet balance: ${ethers.utils.formatEther(balance)} rBTC`);

    if (balance.lt(ethers.utils.parseEther("0.002"))) {
      console.warn("⚠️ Wallet balance may be too low. The test requires at least 0.002 rBTC.");
    }

    // Generate a test reference ID
    const referenceId = ethers.utils.formatBytes32String(`test-${Date.now()}`);
    console.log(`🆔 Reference ID: ${referenceId}`);

    // Create a test user address (this would be the user's World Chain address in production)
    const testUserAddress = wallet.address;
    console.log(`👤 Test user address: ${testUserAddress}`);

    // Call the contract function
    console.log("📤 Sending transaction...");
    const tx = await contract.payForVerification(
      testUserAddress,
      referenceId,
      {
        value: ethers.utils.parseEther("0.001"), // 0.001 rBTC
        gasLimit: 500000 // Adjust as needed (higher for Hyperlane)
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
    
    // Look for MessageSent event
    const messageSentEvents = receipt.events.filter(event => 
      event.topics[0] === ethers.utils.id("MessageSent(address,bytes32,uint32,bytes32)")
    );
    
    if (messageSentEvents.length > 0) {
      const messageEvent = messageSentEvents[0];
      console.log(`📨 Message sent to Hyperlane!`);
      
      // In a real implementation, we would wait for the Hyperlane relayer to deliver the message
      console.log(`⏳ Normally, we would now wait for the Hyperlane relayer to deliver the message...`);
      console.log(`🔗 Check the Hyperlane explorer for message status`);
    } else {
      console.warn(`⚠️ No MessageSent event found in transaction receipt`);
    }

    console.log("✅ Test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Unhandled error:", error);
    process.exit(1);
  }); 