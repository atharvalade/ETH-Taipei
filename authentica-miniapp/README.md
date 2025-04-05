# Authentica World Mini App

Authentica is a verification marketplace that helps verify human-created content vs AI-generated content. Using the World App ecosystem, users can submit content for verification by various providers and receive NFT certificates for verified human-created content.

## Features

- Multiple verification providers with different specialties and accuracy rates
- Content verification with confidence scoring
- Payment integration with World Chain (WRD/USDC) or BTC via Rootstock
- NFT minting for verified human-created content
- World App integration for identity verification and payments

## Getting Started

### Prerequisites

- Node.js 16+ and npm/pnpm
- World App account for testing

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`
4. Run the development server:

```bash
pnpm dev
```

### Testing in World App

To test in the World App:

1. Set up an ngrok tunnel to your local development server:

```bash
ngrok http 3000
```

2. Update your World Developer Portal app settings with the ngrok URL
3. Update the `NEXTAUTH_URL` and redirect URL in `.env` to use your ngrok URL
4. Open the URL in the World App by scanning the QR code from the Developer Portal

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- World MiniKit for World App integration

## World App Integration

This mini app integrates with the World App ecosystem through:

- World ID verification for identity
- World Chain for payments
- NFT minting capabilities

## App Structure

- `/app` - Next.js app pages
- `/components` - Reusable components
- `/public` - Static assets and manifest.json

## Development Notes

- Mobile-first design optimized for World App
- Uses event-based communication with World App for commands
- Supports both in-app and web testing

## License

MIT
