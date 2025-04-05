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
const verification_service_1 = require("../services/verification.service");
const router = express_1.default.Router();
// Request a new verification
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, providerId, content, chain } = req.body;
        // Validate required fields
        if (!userId || !providerId || !content || !chain) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Validate chain value
        if (chain !== 'WORLD' && chain !== 'ROOTSTOCK') {
            return res.status(400).json({ message: 'Invalid chain value. Must be WORLD or ROOTSTOCK' });
        }
        const verification = yield (0, verification_service_1.processVerification)(userId, providerId, content, chain);
        res.status(201).json(verification);
    }
    catch (error) {
        console.error('Error creating verification:', error);
        res.status(500).json({ message: 'Failed to create verification' });
    }
}));
// Get verifications for a user
router.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifications = yield (0, verification_service_1.getUserVerifications)(req.params.userId);
        res.json(verifications);
    }
    catch (error) {
        console.error('Error fetching verifications:', error);
        res.status(500).json({ message: 'Failed to fetch verifications' });
    }
}));
// Get verification by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verification = yield (0, verification_service_1.getVerificationById)(req.params.id);
        if (!verification) {
            return res.status(404).json({ message: 'Verification not found' });
        }
        res.json(verification);
    }
    catch (error) {
        console.error('Error fetching verification:', error);
        res.status(500).json({ message: 'Failed to fetch verification' });
    }
}));
exports.default = router;
