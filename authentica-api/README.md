# Authentica API

A consolidated API for the Authentica verification marketplace. This API handles content storage on IPFS, AI verification, and NFT certification.

## API Endpoints

All operations are accessible through a single endpoint:

```
https://your-vercel-deployment-url.vercel.app/api/authentica
```

### Store Content

Stores content on IPFS and returns a hash and hash key for verification.

**POST /api/authentica**

```json
{
  "content": "Text content to verify",
  "walletAddress": "0x123456789abcdef"
}
```

**Response:**

```json
{
  "success": true,
  "hash": "QmHash...",
  "hashKey": "hashKey123..."
}
```

### Verify Content

Verifies content using AI detection algorithms and returns a result.

**POST /api/authentica**

```json
{
  "action": "verify",
  "providerId": "provider2",
  "hash": "QmHash...",
  "hashKey": "hashKey123...",
  "walletAddress": "0x123456789abcdef",
  "chain": "WORLD"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "isHumanWritten": true,
    "confidenceScore": 0.87,
    "provider": "provider2",
    "chain": "WORLD",
    "hash": "QmHash...",
    "hashKey": "hashKey123..."
  }
}
```

### Update NFT

Links an NFT token ID to a verified content hash.

**POST /api/authentica**

```json
{
  "action": "update-nft",
  "hash": "QmHash...",
  "walletAddress": "0x123456789abcdef",
  "nftTokenId": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "NFT token ID updated successfully"
}
```

### Get User Data

Retrieves a user's transaction history and verification count.

**GET /api/authentica?action=user&walletAddress=0x123456789abcdef**

**Response:**

```json
{
  "success": true,
  "walletAddress": "0x123456789abcdef",
  "verificationCount": 1,
  "transactions": [
    {
      "hash": "QmHash...",
      "hashKey": "hashKey123...",
      "timestamp": "2025-04-05T18:41:38.718Z",
      "result": {
        "isHumanWritten": true,
        "confidenceScore": 0.87,
        "provider": "provider2",
        "chain": "WORLD"
      },
      "nftTokenId": "123456"
    }
  ]
}
```

## Deployment

This API is designed to be deployed on Vercel. Make sure to set the following environment variable:

```
PINATA_JWT=your_pinata_jwt_token
```

## Technologies

- IPFS storage via Pinata
- Next.js API routes
- AI content verification algorithms 