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
exports.evaluateProviderAccuracy = exports.addProvider = exports.verifyContent = exports.getProviderById = exports.getActiveProviders = void 0;
const axios_1 = __importDefault(require("axios"));
const Provider_1 = __importDefault(require("../models/Provider"));
const ipfs_service_1 = require("./ipfs.service");
/**
 * Get all active providers
 */
const getActiveProviders = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Provider_1.default.find({ isActive: true });
});
exports.getActiveProviders = getActiveProviders;
/**
 * Get a provider by ID
 */
const getProviderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Provider_1.default.findById(id);
});
exports.getProviderById = getProviderById;
/**
 * Check content using a provider's API
 */
const verifyContent = (providerId, ipfsHash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get provider info from database
        const provider = yield (0, exports.getProviderById)(providerId);
        if (!provider) {
            throw new Error('Provider not found');
        }
        // Get content from IPFS
        const content = yield (0, ipfs_service_1.getFromIPFS)(ipfsHash);
        // Call provider's API with content
        const response = yield axios_1.default.post(provider.apiEndpoint, { content }, {
            headers: {
                'Authorization': `Bearer ${provider.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        // Mock response structure - this should be adapted to match actual provider API responses
        return {
            isHumanWritten: response.data.isHumanWritten || false,
            confidenceScore: response.data.confidenceScore || 0
        };
    }
    catch (error) {
        console.error('Error verifying content:', error);
        throw new Error('Failed to verify content with provider');
    }
});
exports.verifyContent = verifyContent;
/**
 * Add a new provider
 */
const addProvider = (providerData) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new Provider_1.default(providerData);
    return yield provider.save();
});
exports.addProvider = addProvider;
/**
 * Update provider accuracy score based on test dataset
 */
const evaluateProviderAccuracy = (providerId) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real implementation, this would use a test dataset to evaluate the provider
    // For the hackathon MVP, we'll simulate with a random score between 70-100
    const accuracyScore = 70 + Math.random() * 30;
    yield Provider_1.default.findByIdAndUpdate(providerId, { accuracyScore });
    return accuracyScore;
});
exports.evaluateProviderAccuracy = evaluateProviderAccuracy;
