# Authentica Rootstock-Hyperlane Deployment Guide

This guide provides detailed step-by-step instructions for deploying the Rootstock and World Chain contracts with Hyperlane integration.

## Prerequisites

Make sure you have:

1. Node.js v16+ installed
2. Hyperlane CLI installed (`npm install -g @hyperlane-xyz/cli`)
3. A wallet with:
   - RSK testnet rBTC (get from [RSK faucet](https://faucet.rsk.co/))
   - World Chain testnet tokens
4. MetaMask configured with both networks

## Step 1: Configure Networks in Hardhat

Ensure your `hardhat.config.js` has proper network configurations:

```javascript
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.13",
  networks: {
    "rootstock-testnet": {
      url: "https://public-node.testnet.rsk.co",
      accounts: [PRIVATE_KEY],
      chainId: 31
    },
    "worldchain-testnet": {
      url: process.env.WORLD_CHAIN_RPC_URL || "https://testnet-rpc.worldchain.cool",
      accounts: [PRIVATE_KEY]
    }
  }
};
```

## Step 2: Set Up Environment Variables

Create a `.env` file with the following variables:

```
PRIVATE_KEY=your_private_key_here
WORLD_CHAIN_RPC_URL=https://testnet-rpc.worldchain.cool
HYPERLANE_WEBHOOK_API_KEY=your_api_key_here
```

## Step 3: Deploy Hyperlane Core

First, check which chains are already in the Hyperlane registry:

```bash
npx @hyperlane-xyz/cli registry list
```

If Rootstock or World Chain are not in the registry, initialize them:

```bash
npx @hyperlane-xyz/cli registry init
```

Follow the prompts to add the missing chains.

Now deploy the Hyperlane core contracts to both chains:

```bash
npx @hyperlane-xyz/cli core deploy
```

Make note of the deployed Mailbox addresses on both chains.

## Step 4: Deploy Warp Route

Review and update the warp route configuration in `hyperlane/warp-route-deployment.yaml` if needed.

Deploy the warp route:

```bash
npx @hyperlane-xyz/cli warp deploy --config ./hyperlane/warp-route-deployment.yaml
```

## Step 5: Deploy World Chain Contract

Update `scripts/deploy-worldchain.js` with the actual Hyperlane Mailbox address for World Chain:

```javascript
const HYPERLANE_MAILBOX_ADDRESS = "0x..."; // Update with actual mailbox address
```

Then deploy the contract:

```bash
npx hardhat run scripts/deploy-worldchain.js --network worldchain-testnet
```

This will create a `deployment-worldchain.json` file with the deployed contract information.

## Step 6: Deploy Rootstock Contract

Update `scripts/deploy-rootstock.js` with:
1. The actual Hyperlane Mailbox address for Rootstock
2. The World Chain domain ID (from Hyperlane deployment)
3. The deployed World Chain contract address (converted to bytes32 format)

```javascript
const HYPERLANE_MAILBOX_ADDRESS = "0x..."; // Update with actual mailbox address
const WORLD_CHAIN_DOMAIN = 1337; // Update with actual domain ID
const WORLD_CHAIN_CONTRACT_ADDRESS = "0x..."; // Update with actual contract address
```

Then deploy the contract:

```bash
npx hardhat run scripts/deploy-rootstock.js --network rootstock-testnet
```

This will create a `deployment-rootstock.json` file with the deployed contract information.

## Step 7: Set Up the Event Listener

Update the environment variables with the deployed contract addresses:

```
WORLD_CHAIN_CONTRACT_ADDRESS=your_deployed_address
```

Start the event listener:

```bash
node scripts/event-listener.js
```

For production, set it up as a background service using PM2:

```bash
npm install -g pm2
pm2 start scripts/event-listener.js --name "authentica-event-listener"
```

## Step 8: Update Frontend Environment Variables

Add the deployed contract addresses to your frontend `.env` file:

```
NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS=your_deployed_address
```

## Step 9: Test the Integration

Test the MetaMask deep link:
1. Open the app on a mobile device
2. Select Rootstock payment
3. Confirm it opens MetaMask correctly

Test a transaction:
1. Run the test script: `node scripts/test-rootstock-payment.js`
2. Check that the event listener detects the payment
3. Verify the payment status is updated correctly

## Troubleshooting

### Common Issues:

1. **Insufficient Gas**: Make sure your wallet has enough rBTC for transaction fees
2. **Wrong Chain ID**: Ensure MetaMask is configured with correct chain IDs
3. **Mailbox Address Mismatch**: Double-check all addresses match between contracts
4. **Event Listener Not Working**: Check environment variables and RPC URL
5. **Cross-Chain Message Not Delivered**: Ensure Hyperlane relayers are running

For additional help, check:
- Hyperlane docs: https://docs.hyperlane.xyz/
- Rootstock docs: https://developers.rsk.co/ 