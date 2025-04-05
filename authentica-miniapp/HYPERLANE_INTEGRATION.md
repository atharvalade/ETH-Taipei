# Authentica Rootstock & Hyperlane Integration

This document describes the integration of Rootstock (RSK) blockchain payments and Hyperlane cross-chain messaging into the Authentica verification platform.

## Overview

Authentica now supports two payment methods for content verification:

1. **World Chain** (native) - Using WRD/USDC tokens within the World App
2. **Rootstock (RSK)** - Using rBTC (Bitcoin) via Rootstock blockchain

The Hyperlane protocol is used as a bridge to relay payment confirmations from Rootstock to World Chain, enabling the execution of verification services after successful payments.

## Architecture

The system consists of the following components:

1. **Rootstock Smart Contract** - Receives rBTC payments and sends messages via Hyperlane
2. **World Chain Smart Contract** - Receives messages from Hyperlane and triggers verification
3. **Hyperlane Bridge** - Relays messages between Rootstock and World Chain
4. **Authentica Miniapp** - Provides UI for content verification and payment selection
5. **Authentica API** - Backend service that handles verification and listens for blockchain events

## Payment Flow

### Rootstock (BTC) Payment Flow

1. User selects "Rootstock (BTC)" as the payment method in the Authentica miniapp
2. User submits content to be verified
3. User connects MetaMask wallet to Rootstock network
4. User sends 0.001 rBTC to the Rootstock smart contract
5. Rootstock contract sends a message via Hyperlane to the World Chain contract
6. World Chain contract verifies the payment and emits a ServiceExecuted event
7. Authentica API listens for the ServiceExecuted event and executes the verification
8. User is redirected to the verification result page

### World Chain Payment Flow (existing)

1. User selects "World Chain" as the payment method
2. User submits content to be verified
3. User approves the payment in the World App
4. API confirms the payment and executes the verification
5. User is redirected to the verification result page

## Smart Contracts

### Rootstock Payment Receiver Contract

Located at: `blockchain/rootstock/PaymentReceiver.sol`

This contract:
- Accepts rBTC payments (fixed at 0.001 rBTC for testnet)
- Records payment details
- Sends cross-chain messages via Hyperlane to World Chain

### World Chain Payment Verifier Contract

Located at: `blockchain/worldchain/PaymentVerifier.sol`

This contract:
- Receives messages from Rootstock via Hyperlane
- Verifies the payment details
- Triggers the verification service by emitting events
- Maintains records of verified payments

## Frontend Components

### RootstockPayment Component

Located at: `components/Payment/RootstockPayment.tsx`

This component:
- Handles connecting to MetaMask
- Switching to Rootstock network if needed
- Creating and sending the transaction to the smart contract
- Displaying transaction status and confirmation

### PaymentSelector Component

Located at: `components/Payment/PaymentSelector.tsx`

This component:
- Provides UI to select between World Chain and Rootstock payment methods
- Renders the appropriate payment UI based on selection
- Handles payment callbacks and errors

## Backend Integration

### Hyperlane Webhook API

Located at: `authentica-api/pages/api/hyperlane/payment-webhook.js`

This API endpoint:
- Listens for events from the World Chain contract
- Processes payment verification events
- Triggers verification service execution
- Records payment status

## Deployment

Smart contracts and Hyperlane bridges must be deployed separately from the application. See `blockchain/README.md` for deployment instructions.

## Environment Variables

Add the following environment variables to the `.env` file:

```
# Rootstock Contract Address
NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS=0x...

# Hyperlane Webhook API Key
HYPERLANE_WEBHOOK_API_KEY=your_secret_key
```

## Testing

1. For local testing, use the Rootstock testnet (chainId: 31)
2. Smart contract tests are located in the `blockchain/test` directory
3. Frontend payment tests can be found in the `test-rootstock-payment.js` file

## Security Considerations

1. The Rootstock contract has a fixed price of 0.001 rBTC for testnet
2. Admin functions in the contracts should be properly secured
3. The webhook API uses API key authentication
4. All contracts should be audited before production deployment 