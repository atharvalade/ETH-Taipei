require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const ROOTSTOCK_RPC_URL = process.env.ROOTSTOCK_RPC_URL || "https://public-node.testnet.rsk.co";
const WORLD_CHAIN_RPC_URL = process.env.WORLD_CHAIN_RPC_URL || "https://testnet-rpc.worldchain.cool";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Rootstock Testnet
    "rootstock-testnet": {
      url: ROOTSTOCK_RPC_URL,
      chainId: 31,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.2, // Add a little extra gas for Rootstock
      timeout: 60000
    },
    // World Chain Testnet
    "worldchain-testnet": {
      url: WORLD_CHAIN_RPC_URL,
      chainId: 1337, // Update with actual World Chain testnet chainId when available
      accounts: [PRIVATE_KEY],
      timeout: 60000
    }
  },
  paths: {
    sources: "./",
    artifacts: "./artifacts",
    cache: "./cache"
  },
  // Add Etherscan API key for verification if available
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  // Increase mocha timeout for tests
  mocha: {
    timeout: 60000
  }
}; 