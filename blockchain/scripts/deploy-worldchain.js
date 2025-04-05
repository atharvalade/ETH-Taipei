// Script to deploy the World Chain payment verifier contract
const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  console.log("Deploying World Chain Payment Verifier...");

  // Get the contract factory
  const WorldChainPaymentVerifier = await hre.ethers.getContractFactory("WorldChainPaymentVerifier");
  
  // Get addresses from Hyperlane deployment
  // These will be available after running the hyperlane core deploy and warp deploy commands
  // In production, these should come from configuration or environment variables
  const HYPERLANE_MAILBOX_ADDRESS = "0x..." // Replace with actual mailbox address from Hyperlane deployment on World Chain
  const ROOTSTOCK_DOMAIN = 31; // Hyperlane domain ID for Rootstock testnet
  
  // Convert the Rootstock contract address to bytes32 format
  // This will be the address of the deployed RootstockPaymentReceiver contract
  const ROOTSTOCK_CONTRACT_ADDRESS = "0x..." // Replace with actual deployed Rootstock contract address
  const ROOTSTOCK_CONTRACT_BYTES32 = ethers.utils.hexZeroPad(ROOTSTOCK_CONTRACT_ADDRESS, 32);
  
  // Deploy the contract
  const paymentVerifier = await WorldChainPaymentVerifier.deploy(
    HYPERLANE_MAILBOX_ADDRESS,
    ROOTSTOCK_CONTRACT_BYTES32,
    ROOTSTOCK_DOMAIN
  );

  // Wait for deployment to complete
  await paymentVerifier.deployed();

  console.log(`World Chain Payment Verifier deployed to: ${paymentVerifier.address}`);
  console.log(`Hyperlane Mailbox: ${HYPERLANE_MAILBOX_ADDRESS}`);
  console.log(`Rootstock Domain: ${ROOTSTOCK_DOMAIN}`);
  console.log(`Rootstock Contract (bytes32): ${ROOTSTOCK_CONTRACT_BYTES32}`);
  
  console.log("Deployment complete!");
  
  // Save the deployment information to a file
  const fs = require("fs");
  const deploymentInfo = {
    network: "worldchain-testnet",
    paymentVerifier: paymentVerifier.address,
    hyperlaneMailbox: HYPERLANE_MAILBOX_ADDRESS,
    rootstockDomain: ROOTSTOCK_DOMAIN,
    rootstockContract: ROOTSTOCK_CONTRACT_ADDRESS,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "deployment-worldchain.json", 
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment information saved to deployment-worldchain.json");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 