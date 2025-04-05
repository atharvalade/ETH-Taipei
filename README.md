# Authentica - AI Content Verification Marketplace

Authentica is a verification marketplace for AI generated content detection. It allows verification providers to list their proprietary algorithms through APIs, enabling users to verify whether content is AI-generated or human-written.

## Project Components

The project consists of three main components:

1. **authentica_UI**: The pitch deck website for the project.
2. **authentica-miniapp**: A World Chain (World.org) mini-app that serves as the main interface for users.
3. **authentica_back-end**: The backend API service that handles verification, IPFS storage, and blockchain integration.

## Features

- Content submission and verification through multiple providers
- IPFS storage for content (with hash and hashkey)
- Integration with World Chain for payment
- NFT minting for human-written content with high confidence (>95%)
- User profiles with verification history

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, World MiniKit
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Storage**: IPFS via Infura
- **Blockchain**: World Chain, Rootstock (via Hyperlane bridge)

## Running the Project

### Backend Setup

1. Navigate to the backend directory:
```bash
cd authentica_back-end
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the required settings (see the README in that directory).

4. Start the backend:
```bash
npm start
```

### Mini-App Setup

1. Navigate to the mini-app directory:
```bash
cd authentica-miniapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the required settings including the backend URL:
```
BACKEND_API_URL=http://localhost:3001
# Other environment variables as needed
```

4. Start the mini-app:
```bash
npm run dev
```

## Verification Flow

1. User submits content through the World miniapp
2. Miniapp calls the backend API to store the content in IPFS
3. Backend returns the hash and hashKey to the miniapp
4. Miniapp initiates a smart contract call on World Chain or Rootstock
5. Smart contract calls the backend to get the verification result
6. Backend uses one of the AI detection algorithms to verify the content
7. If the content is human-written with high confidence (>95%), user can mint an NFT

## API Documentation

Detailed API documentation can be found in the README files within each component directory.

## Future Development

- Integration with more verification providers
- Enhanced ML models for better accuracy
- More sophisticated smart contracts and payment options
- Decentralized governance for provider verification metrics

## ETH Taipei Hackathon Project

This project was developed during the ETH Taipei hackathon, focused on leveraging blockchain technology for content verification and authenticity.