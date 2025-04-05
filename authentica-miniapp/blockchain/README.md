# Authentica Blockchain Integration

This directory contains the smart contracts and deployment scripts for Authentica's Rootstock and Hyperlane integration.

## Overview

The integration allows users to make payments in BTC via Rootstock (rBTC) and have the verification service executed on World Chain. The flow is as follows:

1. User sends BTC payment to Rootstock address
2. Rootstock contract receives the payment and sends a message to World Chain via Hyperlane
3. World Chain contract receives the message and triggers the verification service

## Project Structure

- `rootstock/` - Contains the Rootstock smart contract
- `worldchain/` - Contains the World Chain smart contract
- `hyperlane/` - Contains Hyperlane bridge configuration
- `scripts/` - Contains deployment scripts

## Prerequisites

- Node.js v16 or higher
- Hardhat
- Private key with funds on both Rootstock testnet and World Chain testnet
- Hyperlane CLI

## Installation

```bash
# Install dependencies
npm install

# Install Hyperlane CLI (if not already installed)
npm install -g @hyperlane-xyz/cli
```

## Configuration

Create a `.env` file with the following variables:

```
PRIVATE_KEY=your_private_key_here
```

## Deployment

### 1. Deploy Hyperlane Bridge

First, initialize and deploy the Hyperlane core contracts:

```bash
npx hyperlane registry init
npx hyperlane core init
npx hyperlane core deploy
```

Then, deploy the Warp Route:

```bash
npx hyperlane warp deploy --config ./hyperlane/warp-route-deployment.yaml
```

### 2. Deploy Smart Contracts

Update the contract deployment scripts with the actual Hyperlane endpoint addresses and contract addresses.

Deploy to Rootstock testnet:

```bash
npm run deploy:rootstock:testnet
```

Deploy to World Chain testnet:

```bash
npm run deploy:worldchain:testnet
```

## Integration with Backend

The World Chain contract emits events when payments are verified. The backend service should listen for these events and trigger the verification service.

Example event structure:

```javascript
{
  event: "PaymentVerified",
  args: {
    paymentId: "0x...",
    userAddress: "0x...",
    amount: "1000000000000000", // Wei value
    timestamp: 1682345678 // Unix timestamp
  }
}
```

## Testing

To run tests:

```bash
npm test
```

## Security Considerations

- The contract uses a fixed price of 0.001 rBTC for testing purposes. In production, this should be configurable.
- The contracts should be audited before deploying to production.
- Ensure proper access controls are in place for admin functions. 