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
const express_1 = __importDefault(require("express"));
const user_service_1 = require("../services/user.service");
const router = express_1.default.Router();
// Get user data
router.get('/:walletAddress', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { walletAddress } = req.params;
        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }
        const user = yield (0, user_service_1.getOrCreateUser)(walletAddress);
        const transactions = yield (0, user_service_1.getUserTransactionHistory)(walletAddress);
        res.json({
            walletAddress: user.walletAddress,
            username: user.username,
            isWorldIdVerified: user.isWorldIdVerified,
            verificationCount: user.verificationCount,
            transactions
        });
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
}));
// Store content to IPFS
router.post('/store-content', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { walletAddress, content } = req.body;
        if (!walletAddress || !content) {
            return res.status(400).json({ message: 'Wallet address and content are required' });
        }
        const { hash, hashKey } = yield (0, user_service_1.storeContentToIPFS)(walletAddress, content);
        res.status(201).json({
            hash,
            hashKey,
            message: 'Content stored successfully'
        });
    }
    catch (error) {
        console.error('Error storing content:', error);
        res.status(500).json({ message: 'Failed to store content' });
    }
}));
// Get content from IPFS
router.get('/content/:hash/:hashKey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hash, hashKey } = req.params;
        if (!hash || !hashKey) {
            return res.status(400).json({ message: 'Hash and hashKey are required' });
        }
        const content = yield (0, user_service_1.getContentFromIPFS)(hash, hashKey);
        if (!content) {
            return res.status(404).json({ message: 'Content not found or invalid hash key' });
        }
        res.json({ content });
    }
    catch (error) {
        console.error('Error retrieving content:', error);
        res.status(500).json({ message: 'Failed to retrieve content' });
    }
}));
// Update verification result
router.post('/update-verification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { walletAddress, hash, result, transactionHash } = req.body;
        if (!walletAddress || !hash || !result) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        yield (0, user_service_1.updateVerificationResult)(walletAddress, hash, result, transactionHash);
        res.json({ message: 'Verification result updated successfully' });
    }
    catch (error) {
        console.error('Error updating verification result:', error);
        res.status(500).json({ message: 'Failed to update verification result' });
    }
}));
// Update NFT token ID
router.post('/update-nft', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { walletAddress, hash, nftTokenId } = req.body;
        if (!walletAddress || !hash || !nftTokenId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        yield (0, user_service_1.updateNftTokenId)(walletAddress, hash, nftTokenId);
        res.json({ message: 'NFT token ID updated successfully' });
    }
    catch (error) {
        console.error('Error updating NFT token ID:', error);
        res.status(500).json({ message: 'Failed to update NFT token ID' });
    }
}));
exports.default = router;
