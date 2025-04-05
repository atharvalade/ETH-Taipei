"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
// Import routes
const providers_routes_1 = __importDefault(require("./api/providers.routes"));
const verifications_routes_1 = __importDefault(require("./api/verifications.routes"));
const user_routes_1 = __importDefault(require("./api/user.routes"));
const detection_routes_1 = __importDefault(require("./api/detection.routes"));
// Initialize Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/providers', providers_routes_1.default);
app.use('/api/verifications', verifications_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/detection', detection_routes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
// Connect to MongoDB
mongoose_1.default.connect(config_1.config.mongoUri)
    .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(config_1.config.port, () => {
        console.log(`Server running on port ${config_1.config.port}`);
    });
})
    .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});
