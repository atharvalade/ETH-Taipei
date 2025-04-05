// Script to deploy the Rootstock payment receiver contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying Rootstock Payment Receiver...");

  // Get the contract factory
  const RootstockPaymentReceiver = await hre.ethers.getContractFactory("RootstockPaymentReceiver");
  
  // Hardcoded values for testing - in production these would come from configuration
  const LZ_ENDPOINT_ADDRESS = "0x..." // Update with actual Hyperlane/LayerZero endpoint address on Rootstock testnet
  const WORLD_CHAIN_ID = 1337; // Hyperlane chain ID for World Chain - update with actual value
  const WORLD_CHAIN_CONTRACT = "0x..." // Update with actual deployed World Chain contract address
  
  // Deploy the contract
  const paymentReceiver = await RootstockPaymentReceiver.deploy(
    LZ_ENDPOINT_ADDRESS,
    WORLD_CHAIN_ID,
    WORLD_CHAIN_CONTRACT
  );

  // Wait for deployment to complete
  await paymentReceiver.deployed();

  console.log(`Rootstock Payment Receiver deployed to: ${paymentReceiver.address}`);
  console.log(`Verification price set to: 0.001 rBTC`);
  
  console.log("Deployment complete!");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 