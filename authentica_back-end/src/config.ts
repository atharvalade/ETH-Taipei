import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/authentica',
  ipfsApiUrl: process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001',
  ipfsApiKey: process.env.IPFS_API_KEY || '',
  ipfsApiSecret: process.env.IPFS_API_SECRET || '',
  worldChainRpc: process.env.WORLD_CHAIN_RPC || 'https://testnet-rpc.worldcoin.org',
  rootstockRpc: process.env.ROOTSTOCK_RPC || 'https://public-node.testnet.rsk.co',
  platformFeePercentage: Number(process.env.PLATFORM_FEE_PERCENTAGE || '5'),
}; 