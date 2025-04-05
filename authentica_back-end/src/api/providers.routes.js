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
const provider_service_1 = require("../services/provider.service");
const verification_service_1 = require("../services/verification.service");
const router = express_1.default.Router();
// Get all active providers with stats
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const providers = yield (0, verification_service_1.getProvidersWithStats)();
        res.json(providers);
    }
    catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ message: 'Failed to fetch providers' });
    }
}));
// Get provider by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = yield (0, provider_service_1.getProviderById)(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.json(provider);
    }
    catch (error) {
        console.error('Error fetching provider:', error);
        res.status(500).json({ message: 'Failed to fetch provider' });
    }
}));
// Add a new provider
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, apiEndpoint, apiKey, walletAddress, price, currency } = req.body;
        // Validate required fields
        if (!name || !description || !apiEndpoint || !apiKey || !walletAddress || !price || !currency) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const provider = yield (0, provider_service_1.addProvider)({
            name,
            description,
            apiEndpoint,
            apiKey,
            walletAddress,
            price,
            currency,
            isActive: true
        });
        // Evaluate provider accuracy
        const accuracyScore = yield (0, provider_service_1.evaluateProviderAccuracy)(provider._id.toString());
        provider.accuracyScore = accuracyScore;
        yield provider.save();
        res.status(201).json(provider);
    }
    catch (error) {
        console.error('Error adding provider:', error);
        res.status(500).json({ message: 'Failed to add provider' });
    }
}));
// Update provider
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = yield (0, provider_service_1.getProviderById)(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        const { name, description, apiEndpoint, apiKey, walletAddress, price, currency, isActive } = req.body;
        if (name)
            provider.name = name;
        if (description)
            provider.description = description;
        if (apiEndpoint)
            provider.apiEndpoint = apiEndpoint;
        if (apiKey)
            provider.apiKey = apiKey;
        if (walletAddress)
            provider.walletAddress = walletAddress;
        if (price)
            provider.price = price;
        if (currency)
            provider.currency = currency;
        if (isActive !== undefined)
            provider.isActive = isActive;
        yield provider.save();
        res.json(provider);
    }
    catch (error) {
        console.error('Error updating provider:', error);
        res.status(500).json({ message: 'Failed to update provider' });
    }
}));
exports.default = router;
