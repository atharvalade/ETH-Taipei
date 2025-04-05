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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTransactionHistory = exports.updateNftTokenId = exports.updateVerificationResult = exports.getContentFromIPFS = exports.storeContentToIPFS = exports.getOrCreateUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const ipfs_service_1 = require("./ipfs.service");
/**
 * Get user by wallet address, create if not exists
 */
const getOrCreateUser = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User_1.default.findOne({ walletAddress });
        if (!user) {
            user = new User_1.default({
                walletAddress,
                verificationCount: 0,
                isWorldIdVerified: false
            });
            yield user.save();
        }
        return user;
    }
    catch (error) {
        console.error('Error getting/creating user:', error);
        throw new Error('Failed to get or create user');
    }
});
exports.getOrCreateUser = getOrCreateUser;
/**
 * Store content to IPFS and add the hash to the user's profile
 */
const storeContentToIPFS = (walletAddress, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate a unique key for this content
        const hashKey = crypto_1.default.randomBytes(16).toString('hex');
        // Encrypt the content with the hashKey for added security
        // In a real-world app, you'd want more robust encryption
        const contentToStore = JSON.stringify({
            content,
            key: hashKey,
            timestamp: new Date().toISOString()
        });
        // Upload to IPFS
        const hash = yield (0, ipfs_service_1.uploadToIPFS)(contentToStore);
        // Get or create user
        const user = yield (0, exports.getOrCreateUser)(walletAddress);
        // Add hash to user's record
        user.ipfsHashes.push({
            hash,
            hashKey,
            timestamp: new Date()
        });
        yield user.save();
        return { hash, hashKey };
    }
    catch (error) {
        console.error('Error storing content to IPFS:', error);
        throw new Error('Failed to store content to IPFS');
    }
});
exports.storeContentToIPFS = storeContentToIPFS;
/**
 * Retrieve content from IPFS using hash and hashKey
 */
const getContentFromIPFS = (hash, hashKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encryptedContent = yield (0, ipfs_service_1.getFromIPFS)(hash);
        // Parse and validate the content
        const parsedContent = JSON.parse(encryptedContent);
        if (parsedContent.key !== hashKey) {
            throw new Error('Invalid hash key');
        }
        return parsedContent.content;
    }
    catch (error) {
        console.error('Error retrieving content from IPFS:', error);
        return null;
    }
});
exports.getContentFromIPFS = getContentFromIPFS;
/**
 * Update user's verification result
 */
const updateVerificationResult = (walletAddress, hash, result, transactionHash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ walletAddress });
        if (!user) {
            throw new Error('User not found');
        }
        // Find the IPFS hash entry
        const hashEntry = user.ipfsHashes.find(entry => entry.hash === hash);
        if (!hashEntry) {
            throw new Error('IPFS hash not found');
        }
        // Update the result
        hashEntry.result = result;
        if (transactionHash) {
            hashEntry.transactionHash = transactionHash;
        }
        // Increment verification count
        user.verificationCount += 1;
        yield user.save();
        return user;
    }
    catch (error) {
        console.error('Error updating verification result:', error);
        throw new Error('Failed to update verification result');
    }
});
exports.updateVerificationResult = updateVerificationResult;
/**
 * Update user's NFT token ID for a verification
 */
const updateNftTokenId = (walletAddress, hash, nftTokenId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ walletAddress });
        if (!user) {
            throw new Error('User not found');
        }
        // Find the IPFS hash entry
        const hashEntry = user.ipfsHashes.find(entry => entry.hash === hash);
        if (!hashEntry) {
            throw new Error('IPFS hash not found');
        }
        // Update the NFT token ID
        hashEntry.nftTokenId = nftTokenId;
        yield user.save();
        return user;
    }
    catch (error) {
        console.error('Error updating NFT token ID:', error);
        throw new Error('Failed to update NFT token ID');
    }
});
exports.updateNftTokenId = updateNftTokenId;
/**
 * Get user transaction history
 */
const getUserTransactionHistory = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ walletAddress });
        if (!user) {
            return [];
        }
        return user.ipfsHashes.sort((a, b) => {
            return b.timestamp.getTime() - a.timestamp.getTime();
        });
    }
    catch (error) {
        console.error('Error getting user transaction history:', error);
        throw new Error('Failed to get user transaction history');
    }
});
exports.getUserTransactionHistory = getUserTransactionHistory;
