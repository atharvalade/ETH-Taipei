// Script to deploy the Rootstock payment receiver contract
const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  console.log("Deploying Rootstock Payment Receiver...");

  // Get the contract factory
  const RootstockPaymentReceiver = await hre.ethers.getContractFactory("RootstockPaymentReceiver");
  
  // Get addresses from Hyperlane deployment
  // These will be available after running the hyperlane core deploy and warp deploy commands
  // In production, these should come from configuration or environment variables
  const HYPERLANE_MAILBOX_ADDRESS = "0x..." // Replace with actual mailbox address from Hyperlane deployment
  const WORLD_CHAIN_DOMAIN = 1337; // Hyperlane domain ID for World Chain - update with actual value
  
  // Convert the World Chain contract address to bytes32 format
  // This will be the address of the deployed WorldChainPaymentVerifier contract
  const WORLD_CHAIN_CONTRACT_ADDRESS = "0x..." // Replace with actual deployed World Chain contract address
  const WORLD_CHAIN_CONTRACT_BYTES32 = ethers.utils.hexZeroPad(WORLD_CHAIN_CONTRACT_ADDRESS, 32);
  
  // Deploy the contract
  const paymentReceiver = await RootstockPaymentReceiver.deploy(
    HYPERLANE_MAILBOX_ADDRESS,
    WORLD_CHAIN_DOMAIN,
    WORLD_CHAIN_CONTRACT_BYTES32
  );

  // Wait for deployment to complete
  await paymentReceiver.deployed();

  console.log(`Rootstock Payment Receiver deployed to: ${paymentReceiver.address}`);
  console.log(`Hyperlane Mailbox: ${HYPERLANE_MAILBOX_ADDRESS}`);
  console.log(`World Chain Domain: ${WORLD_CHAIN_DOMAIN}`);
  console.log(`World Chain Contract (bytes32): ${WORLD_CHAIN_CONTRACT_BYTES32}`);
  console.log(`Verification price set to: 0.001 rBTC`);
  
  console.log("Deployment complete!");
  
  // Save the deployment information to a file
  const fs = require("fs");
  const deploymentInfo = {
    network: "rootstock-testnet",
    paymentReceiver: paymentReceiver.address,
    hyperlaneMailbox: HYPERLANE_MAILBOX_ADDRESS,
    worldChainDomain: WORLD_CHAIN_DOMAIN,
    worldChainContract: WORLD_CHAIN_CONTRACT_ADDRESS,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "deployment-rootstock.json", 
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment information saved to deployment-rootstock.json");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 