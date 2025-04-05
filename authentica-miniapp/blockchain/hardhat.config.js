require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

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
      url: "https://public-node.testnet.rsk.co",
      chainId: 31,
      accounts: [PRIVATE_KEY]
    },
    // World Chain Testnet (placeholder - update with actual URL when available)
    "worldchain-testnet": {
      url: "https://testnet-rpc.worldchain.cool", // Placeholder URL - update with actual World Chain testnet RPC
      chainId: 1337, // Placeholder chainId - update with actual World Chain testnet chainId
      accounts: [PRIVATE_KEY]
    }
  },
  paths: {
    sources: "./",
    artifacts: "./artifacts",
    cache: "./cache"
  }
}; 