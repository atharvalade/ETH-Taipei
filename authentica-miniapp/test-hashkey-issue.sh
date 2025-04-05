#!/bin/bash

# Test script to diagnose hashKey encoding/decoding issues using curl
API_URL="https://ipfs-api1-ethtaipei.vercel.app/api/authentica"

echo "Testing hashKey handling in authentica API"
echo 

# Step 1: Store content to get hash and hashKey
echo "Step 1: Submitting content to get hash and hashKey..."
WALLET_ADDRESS="0xTestWalletHashKey123"
CONTENT="This is test content for verification with special characters handling"

STORE_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"content\": \"$CONTENT\", \"walletAddress\": \"$WALLET_ADDRESS\"}" \
  $API_URL)

echo "Store response: $STORE_RESPONSE"

# Extract hash and hashKey using grep and sed
HASH=$(echo $STORE_RESPONSE | grep -o '"hash":"[^"]*"' | sed 's/"hash":"//;s/"//')
HASH_KEY=$(echo $STORE_RESPONSE | grep -o '"hashKey":"[^"]*"' | sed 's/"hashKey":"//;s/"//')

echo "Received hash: $HASH"
echo "Received hashKey: $HASH_KEY"

# Step 2: Simulate URL parameter handling
echo
echo "Step 2: Simulating URL parameter handling..."

# Encode the hashKey as it would be in the URL
ENCODED_HASH_KEY=$(echo -n "$HASH_KEY" | node -e "const str=require('fs').readFileSync(0, 'utf-8'); console.log(encodeURIComponent(str))")
echo "Encoded hashKey for URL: $ENCODED_HASH_KEY"

# Decode as it would happen in the result page
DECODED_HASH_KEY=$(echo -n "$ENCODED_HASH_KEY" | node -e "const str=require('fs').readFileSync(0, 'utf-8'); console.log(decodeURIComponent(str))")
echo "Decoded hashKey from URL: $DECODED_HASH_KEY"

if [ "$HASH_KEY" == "$DECODED_HASH_KEY" ]; then
  echo "Decoded matches original: YES ✓"
else
  echo "Decoded matches original: NO ✗"
fi

# Step 3: Verify using original hashKey
echo
echo "Step 3: Verifying with original hashKey..."
echo "Verifying content with hashKey: $HASH_KEY"

VERIFY_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"action\": \"verify\", \"providerId\": \"provider1\", \"hash\": \"$HASH\", \"hashKey\": \"$HASH_KEY\", \"walletAddress\": \"$WALLET_ADDRESS\", \"chain\": \"WORLD\"}" \
  $API_URL)

echo "$VERIFY_RESPONSE" | grep -q "\"success\":true"
if [ $? -eq 0 ]; then
  echo "Verification successful!"
  echo "Result: $VERIFY_RESPONSE"
else
  echo "Verification failed: $VERIFY_RESPONSE"
fi

# Step 4: Verify using encoded+decoded hashKey
echo
echo "Step 4: Verifying with encoded+decoded hashKey..."
echo "Verifying content with hashKey: $DECODED_HASH_KEY"

VERIFY_RESPONSE_2=$(curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"action\": \"verify\", \"providerId\": \"provider1\", \"hash\": \"$HASH\", \"hashKey\": \"$DECODED_HASH_KEY\", \"walletAddress\": \"$WALLET_ADDRESS\", \"chain\": \"WORLD\"}" \
  $API_URL)

echo "$VERIFY_RESPONSE_2" | grep -q "\"success\":true"
if [ $? -eq 0 ]; then
  echo "Verification successful!"
  echo "Result: $VERIFY_RESPONSE_2" 
else
  echo "Verification failed: $VERIFY_RESPONSE_2"
fi

echo
echo "Test completed successfully" 