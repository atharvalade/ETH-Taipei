"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/authentica',
    ipfsApiUrl: process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001',
    ipfsApiKey: process.env.IPFS_API_KEY || '',
    ipfsApiSecret: process.env.IPFS_API_SECRET || '',
    worldChainRpc: process.env.WORLD_CHAIN_RPC || 'https://testnet-rpc.worldcoin.org',
    rootstockRpc: process.env.ROOTSTOCK_RPC || 'https://public-node.testnet.rsk.co',
    platformFeePercentage: Number(process.env.PLATFORM_FEE_PERCENTAGE || '5'),
};
