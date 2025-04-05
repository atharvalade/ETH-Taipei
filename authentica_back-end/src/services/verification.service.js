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
exports.getProvidersWithStats = exports.getVerificationById = exports.getUserVerifications = exports.processVerification = void 0;
const ipfs_service_1 = require("./ipfs.service");
const provider_service_1 = require("./provider.service");
const blockchain_service_1 = require("./blockchain.service");
const Verification_1 = __importDefault(require("../models/Verification"));
const Provider_1 = __importDefault(require("../models/Provider"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Process a new verification request
 */
const processVerification = (userId, providerId, content, chain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if provider exists
        const provider = yield (0, provider_service_1.getProviderById)(providerId);
        if (!provider) {
            throw new Error('Provider not found');
        }
        // Upload content to IPFS
        const contentIpfsHash = yield (0, ipfs_service_1.uploadToIPFS)(content);
        // Create verification record
        const verification = new Verification_1.default({
            userId,
            providerId: new mongoose_1.default.Types.ObjectId(providerId),
            contentIpfsHash,
            chain,
            status: 'PENDING'
        });
        yield verification.save();
        // Process this verification (in real-world, this would be an async process)
        void executeVerification(verification._id.toString());
        return verification;
    }
    catch (error) {
        console.error('Error processing verification:', error);
        throw new Error('Failed to process verification request');
    }
});
exports.processVerification = processVerification;
/**
 * Execute the verification process
 */
const executeVerification = (verificationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get verification request
        const verification = yield Verification_1.default.findById(verificationId);
        if (!verification) {
            throw new Error('Verification not found');
        }
        // Get verification result from provider
        const result = yield (0, provider_service_1.verifyContent)(verification.providerId.toString(), verification.contentIpfsHash);
        // Update verification with result
        verification.isHumanWritten = result.isHumanWritten;
        verification.confidenceScore = result.confidenceScore;
        verification.status = 'COMPLETED';
        verification.completedAt = new Date();
        yield verification.save();
        // Submit result to blockchain (creates event and mints NFT if applicable)
        if (verification.transactionHash) {
            yield (0, blockchain_service_1.submitVerificationResult)(verification.transactionHash, result.isHumanWritten, result.confidenceScore, verification.chain);
        }
    }
    catch (error) {
        console.error('Error executing verification:', error);
        // Update verification status to failed
        yield Verification_1.default.findByIdAndUpdate(verificationId, {
            status: 'FAILED'
        });
    }
});
/**
 * Get all verifications for a user
 */
const getUserVerifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Verification_1.default.find({ userId }).populate('providerId').sort({ createdAt: -1 });
});
exports.getUserVerifications = getUserVerifications;
/**
 * Get verification by ID
 */
const getVerificationById = (verificationId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Verification_1.default.findById(verificationId).populate('providerId');
});
exports.getVerificationById = getVerificationById;
/**
 * Get providers with stats
 */
const getProvidersWithStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const providers = yield Provider_1.default.find({ isActive: true });
    const providerStats = yield Promise.all(providers.map((provider) => __awaiter(void 0, void 0, void 0, function* () {
        const verificationCount = yield Verification_1.default.countDocuments({
            providerId: provider._id,
            status: 'COMPLETED'
        });
        const accurateVerifications = yield Verification_1.default.countDocuments({
            providerId: provider._id,
            status: 'COMPLETED',
            isHumanWritten: true,
            confidenceScore: { $gte: 0.90 }
        });
        return Object.assign(Object.assign({}, provider.toObject()), { verificationCount, accuracy: verificationCount > 0 ? accurateVerifications / verificationCount : 0 });
    })));
    return providerStats;
});
exports.getProvidersWithStats = getProvidersWithStats;
