# Testing Your Mini App

This guide will walk you through testing your Authentica mini app on your phone with World App.

## Prerequisites

- [ngrok](https://ngrok.com/) installed
- [World App](https://worldcoin.org/world-app) installed on your mobile device
- Developer account on [World Developer Portal](https://developer.worldcoin.org)

## Step 1: Run your app locally

Make sure your app is running on localhost:

```bash
pnpm dev
```

This should start your Next.js app on http://localhost:3000 (or another port if 3000 is in use).

## Step 2: Set up ngrok tunnel

In a new terminal window, run:

```bash
ngrok http 3000
```

This will create a secure tunnel to your localhost and provide a public URL (e.g., https://abc123.ngrok.io).

## Step 3: Configure your app in the World Developer Portal

1. Log in to the [World Developer Portal](https://developer.worldcoin.org)
2. Navigate to your app (or create a new one)
3. Set the following values:
   - **App URL**: Use the ngrok URL from Step 2
   - **Redirect URL**: Add the ngrok URL + `/api/auth/callback/worldcoin` (e.g., https://abc123.ngrok.io/api/auth/callback/worldcoin)
   - **Action Name**: Make sure this matches the action name in your code (default: "World_MiniApp")

## Step 4: Update your .env file

Create or update your .env file with:

```
# Base URL for your app
NEXTAUTH_URL=your-ngrok-url (e.g., https://abc123.ngrok.io)

# World ID credentials from Developer Portal
WLD_CLIENT_ID=your-client-id
WLD_CLIENT_SECRET=your-client-secret
APP_ID=your-app-id
DEV_PORTAL_API_KEY=your-api-key

# The action name configured in the Developer Portal
ACTION_NAME=World_MiniApp
```

## Step 5: Restart your local server

Stop and restart your Next.js server to load the new environment variables:

```bash
pnpm dev
```

## Step 6: Test on your phone

1. In the World Developer Portal, go to your app's overview
2. Find the QR code for testing
3. Open World App on your phone
4. Scan the QR code using World App
5. Your mini app should now open inside World App

## Troubleshooting

- **Can't connect to mini app**: Make sure your ngrok tunnel is running
- **Authentication errors**: Check your WLD_CLIENT_ID and WLD_CLIENT_SECRET
- **Missing features**: Ensure you've granted the necessary permissions in the manifest.json file
- **Payment issues**: Verify your wallet is set up in World App

## Testing Tips

- Use your phone's developer options to keep the screen on during testing
- If the mini app doesn't appear, try force-closing World App and trying again
- For more detailed logs, monitor the browser console using remote debugging
- Remember that ngrok URLs expire, so you'll need to update your configuration when starting a new session 