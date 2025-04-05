# Authentica Backend

Backend services for the Authentica platform - a verification marketplace for AI-generated content detection.

## Overview

Authentica is a platform that allows verification providers to offer their proprietary AI content detection algorithms through standardized APIs. Users can submit content to be verified, and if the content is determined to be human-written with high confidence, they can mint an NFT certificate.

## Features

- Provider management system
- Content verification through provider APIs
- IPFS integration for secure content storage
- Smart contract integration with World Chain and Rootstock
- NFT minting for verified human-written content

## Technology Stack

- Node.js with Express
- TypeScript
- MongoDB (through Mongoose)
- IPFS for decentralized storage
- World Chain for payments and verification
- Rootstock + Hyperlane for BTC payments
- OpenZeppelin for smart contract functionality

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in your values

3. Run in development mode:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

5. Run in production:
   ```
   npm start
   ```

## API Endpoints

### Providers
- `GET /api/providers` - Get all active providers with stats
- `GET /api/providers/:id` - Get provider by ID
- `POST /api/providers` - Add a new provider
- `PUT /api/providers/:id` - Update a provider

### Verifications
- `POST /api/verifications` - Request a new verification
- `GET /api/verifications/user/:userId` - Get verifications for a user
- `GET /api/verifications/:id` - Get verification by ID

## Smart Contracts

The `VerificationMarketplace.sol` contract handles:
- Provider registration
- Payment processing
- Verification result recording
- NFT minting for verified content