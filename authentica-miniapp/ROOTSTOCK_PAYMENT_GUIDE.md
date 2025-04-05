# Rootstock Payment Integration Guide

This guide explains the Rootstock payment integration in Authentica miniapp, including the direct payment flow and Hyperlane cross-chain integration.

## Overview

The Authentica miniapp now supports payment via Rootstock (RSK) testnet rBTC, with two possible flows:

1. **Direct Payment Flow**: Users send 0.00001 rBTC directly to a specified wallet address
2. **Contract-Based Flow**: Users interact with a smart contract that forwards payments to the specified wallet and sends cross-chain messages via Hyperlane

Both methods support MetaMask mobile deep linking for a seamless payment experience.

## Technical Implementation

### Payment Wallet

All payments are sent to a fixed wallet address:

```
0xa20C96EA7B9AbAe32217EbA25577cDe099039D5D
```

### Payment Amount

The fixed payment amount is **0.00001 rBTC** (10^-5 rBTC).

### Smart Contracts

We use two smart contracts to facilitate cross-chain communication:

1. **RootstockPaymentReceiver**: Deployed on Rootstock testnet
   - Receives user payments and forwards them to the payment wallet
   - Sends cross-chain messages to World Chain via Hyperlane

2. **WorldChainPaymentVerifier**: Deployed on World Chain
   - Receives messages from Rootstock via Hyperlane
   - Verifies payments and triggers verification service

### Fallback Mechanism

If the Hyperlane cross-chain messaging fails:

1. The event listener detects direct payments to the wallet
2. The admin can trigger manual verification via the fallback function
3. The verification service proceeds as if the payment was verified through the normal flow

## Deep Link Generation

### Direct Payment Deep Link

```javascript
// Create a transaction for direct payment
const txParams = {
  to: PAYMENT_WALLET_ADDRESS,
  value: (0.00001 * 1e18).toString(10), // Convert to wei
  data: '0x', // No data for simple transfer
  chainId: 31, // Rootstock testnet
  memo: `Authentica-${referenceId}` // Reference ID in memo
};

// Create MetaMask deep link
const encodedTx = encodeURIComponent(JSON.stringify(txParams));
const deepLink = `metamask://wc?uri=${encodedTx}`;
```

### Contract Payment Deep Link

```javascript
// Function signature for payForVerification
const functionSignature = "0xb8170e5d";

// Encode parameters
const encodedAddress = userAddress.padStart(64, '0');
const encodedReferenceId = referenceIdBytes.padEnd(64, '0');

// Create data field
const data = `${functionSignature}${encodedAddress}${encodedReferenceId}`;

// Create transaction
const txParams = {
  to: ROOTSTOCK_CONTRACT_ADDRESS,
  value: (0.00001 * 1e18).toString(10),
  data: data,
  chainId: 31
};

// Create MetaMask deep link
const encodedTx = encodeURIComponent(JSON.stringify(txParams));
const deepLink = `metamask://wc?uri=${encodedTx}`;
```

## Event Listener

The event listener monitors:

1. **Rootstock Contract Events**: `PaymentReceived` and `FallbackProcessActivated`
2. **World Chain Contract Events**: `PaymentVerified` and `ServiceExecuted`
3. **Direct Payments**: Monitors the payment wallet address for incoming transactions

When a valid payment is detected, it either:
- Updates the payment status if Hyperlane successfully relayed the message
- Triggers the fallback verification process if Hyperlane messaging failed

## Testing

To test the payment flow:

1. **Direct Payment Test**:
   ```
   node test-rootstock-payment.js
   ```

2. **Contract-Based Payment Test** (if contract is deployed):
   ```
   node test-rootstock-payment.js --use-contract
   ```

## Environment Variables

Required environment variables:

```
# Required
NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=0xa20C96EA7B9AbAe32217EbA25577cDe099039D5D
ROOTSTOCK_RPC_URL=https://public-node.testnet.rsk.co
WORLD_CHAIN_RPC_URL=https://testnet-rpc.worldchain.cool

# Optional (for contract-based flow)
NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS=0x...
WORLD_CHAIN_CONTRACT_ADDRESS=0x...

# For admin operations (fallback verification)
ADMIN_PRIVATE_KEY=your-admin-private-key
```

## Production Deployment

For production deployment:

1. Ensure all environment variables are set in Vercel dashboard
2. Deploy the event listener as a background service using PM2
3. Set up monitoring for the event listener to ensure it stays running

## Troubleshooting

Common issues:

1. **Failed Payments**: Check that the user has sufficient rBTC (at least 0.00002 rBTC)
2. **Event Listener Not Detecting Payments**: Verify RPC URL connections and contract addresses
3. **Hyperlane Messages Not Delivered**: Verify Hyperlane relayer is running and properly configured 