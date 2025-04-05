// Script to deploy the World Chain payment verifier contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying World Chain Payment Verifier...");

  // Get the contract factory
  const WorldChainPaymentVerifier = await hre.ethers.getContractFactory("WorldChainPaymentVerifier");
  
  // Hardcoded values for testing - in production these would come from configuration
  const LZ_ENDPOINT_ADDRESS = "0x..." // Update with actual Hyperlane/LayerZero endpoint address on World Chain
  const ROOTSTOCK_CHAIN_ID = 31; // Hyperlane chain ID for Rootstock testnet
  const ROOTSTOCK_CONTRACT = "0x..." // Update with actual deployed Rootstock contract address
  
  // Deploy the contract
  const paymentVerifier = await WorldChainPaymentVerifier.deploy(
    LZ_ENDPOINT_ADDRESS,
    ROOTSTOCK_CONTRACT,
    ROOTSTOCK_CHAIN_ID
  );

  // Wait for deployment to complete
  await paymentVerifier.deployed();

  console.log(`World Chain Payment Verifier deployed to: ${paymentVerifier.address}`);
  
  console.log("Deployment complete!");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 