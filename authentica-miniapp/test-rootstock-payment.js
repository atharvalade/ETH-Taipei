/**
 * Test script for the Rootstock payment flow
 * 
 * This script tests the interaction with the Rootstock smart contract
 * for making payments. It requires MetaMask to be installed and configured
 * with the Rootstock testnet.
 * 
 * To run:
 * node test-rootstock-payment.js
 */

const { ethers } = require('ethers');
require('dotenv').config();

// Configuration
const ROOTSTOCK_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// ABI for the payForVerification function
const ABI = [
  "function payForVerification(address _userAddress, bytes32 _referenceId) external payable"
];

async function main() {
  try {
    console.log("🧪 Testing Rootstock payment flow...");

    // Check for required environment variables
    if (!ROOTSTOCK_CONTRACT_ADDRESS) {
      throw new Error("Missing NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS in .env file");
    }
    
    if (!PRIVATE_KEY) {
      throw new Error("Missing PRIVATE_KEY in .env file");
    }

    // Connect to Rootstock testnet
    const provider = new ethers.providers.JsonRpcProvider("https://public-node.testnet.rsk.co");
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
        gasLimit: 300000 // Adjust as needed
      }
    );

    console.log(`🔄 Transaction sent: ${tx.hash}`);
    console.log("⏳ Waiting for confirmation...");

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

    // Parse event logs from the receipt
    const eventSignature = "PaymentReceived(address,uint256,bytes32)";
    const eventTopic = ethers.utils.id(eventSignature);

    const paymentReceivedLog = receipt.logs.find(log => 
      log.topics[0] === eventTopic
    );

    if (paymentReceivedLog) {
      const paymentIdHex = paymentReceivedLog.topics[3];
      console.log(`🔑 Payment ID: ${paymentIdHex}`);
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