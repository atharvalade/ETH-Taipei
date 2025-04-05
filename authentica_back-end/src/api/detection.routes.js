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
const ai_detection_service_1 = require("../services/ai-detection.service");
const user_service_1 = require("../services/user.service");
const user_service_2 = require("../services/user.service");
const router = express_1.default.Router();
// Verify content with a specific provider
router.post('/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { providerId, hash, hashKey, walletAddress, chain } = req.body;
        if (!providerId || !hash || !hashKey || !walletAddress || !chain) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Validate chain value
        if (chain !== 'WORLD' && chain !== 'ROOTSTOCK') {
            return res.status(400).json({ message: 'Invalid chain value. Must be WORLD or ROOTSTOCK' });
        }
        // Get verification result from provider
        const result = yield (0, ai_detection_service_1.getVerificationFromProvider)(providerId, hash, hashKey);
        // Update user's verification history
        yield (0, user_service_2.updateVerificationResult)(walletAddress, hash, {
            isHumanWritten: result.isHumanWritten,
            confidenceScore: result.confidenceScore,
            provider: providerId,
            chain
        });
        // Return verification result
        res.json({
            isHumanWritten: result.isHumanWritten,
            confidenceScore: result.confidenceScore,
            provider: providerId,
            chain,
            hash,
            hashKey
        });
    }
    catch (error) {
        console.error('Error in verification:', error);
        res.status(500).json({ message: 'Failed to verify content' });
    }
}));
// Get content to verify
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
exports.default = router;
