"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerificationDetails = exports.submitVerificationResult = exports.registerProvider = void 0;
const ethers_1 = require("ethers");
const config_1 = require("../config");
// Import contract ABI - in a real project, this would be imported from a compiled contract
// We'll use a placeholder for now
const contractABI = []; // This would be the compiled contract ABI
// Setup for World Chain
const worldChainConfig = {
    rpcUrl: config_1.config.worldChainRpc,
    contractAddress: process.env.WORLD_CONTRACT_ADDRESS || '',
    privateKey: process.env.WORLD_PRIVATE_KEY || ''
};
// Setup for Rootstock
const rootstockConfig = {
    rpcUrl: config_1.config.rootstockRpc,
    contractAddress: process.env.ROOTSTOCK_CONTRACT_ADDRESS || '',
    privateKey: process.env.ROOTSTOCK_PRIVATE_KEY || ''
};
/**
 * Get provider and contract instance for the specified chain
 */
const getContractInstance = (chain) => {
    const config = chain === 'WORLD' ? worldChainConfig : rootstockConfig;
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers_1.ethers.Wallet(config.privateKey, provider);
    const contract = new ethers_1.ethers.Contract(config.contractAddress, contractABI, wallet);
    return { provider, wallet, contract };
};
/**
 * Register a provider on the blockchain
 */
const registerProvider = (providerId, walletAddress, price, tokenPrice, chain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contract } = getContractInstance(chain);
        const tx = yield contract.registerProvider(providerId, walletAddress, ethers_1.ethers.utils.parseEther(price.toString()), ethers_1.ethers.utils.parseEther(tokenPrice.toString()));
        return yield tx.wait();
    }
    catch (error) {
        console.error(`Error registering provider on ${chain}:`, error);
        throw new Error(`Failed to register provider on ${chain}`);
    }
});
exports.registerProvider = registerProvider;
/**
 * Submit verification result to the blockchain
 */
const submitVerificationResult = (requestId, isHumanWritten, confidenceScore, chain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contract } = getContractInstance(chain);
        // Convert confidence score to contract format (95% = 9500)
        const scoreForContract = Math.floor(confidenceScore * 100);
        const tx = yield contract.submitVerificationResult(requestId, isHumanWritten, scoreForContract);
        return yield tx.wait();
    }
    catch (error) {
        console.error(`Error submitting verification result on ${chain}:`, error);
        throw new Error(`Failed to submit verification result on ${chain}`);
    }
});
exports.submitVerificationResult = submitVerificationResult;
/**
 * Get verification details from the blockchain
 */
const getVerificationDetails = (requestId, chain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contract } = getContractInstance(chain);
        const verificationData = yield contract.verificationRequests(requestId);
        return {
            ipfsContentHash: verificationData.ipfsContentHash,
            user: verificationData.user,
            isVerified: verificationData.isVerified,
            isHumanWritten: verificationData.isHumanWritten,
            confidenceScore: Number(verificationData.confidenceScore) / 100, // Convert from contract format
            isCompleted: verificationData.isCompleted
        };
    }
    catch (error) {
        console.error(`Error getting verification details from ${chain}:`, error);
        throw new Error(`Failed to get verification details from ${chain}`);
    }
});
exports.getVerificationDetails = getVerificationDetails;
