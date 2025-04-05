// Test script to get user's hashes first, then verify one of them

const API_URL = "https://ipfs-api1-ethtaipei.vercel.app/api/authentica";
const WALLET_ADDRESS = "0xTest123"; // Same wallet we used earlier

async function testUserHashes() {
  console.log("Testing user hash retrieval and verification");
  console.log(`Wallet Address: ${WALLET_ADDRESS}`);
  
  try {
    // Step 1: Get user data to see their hashes
    console.log("\nStep 1: Getting user data...");
    const response = await fetch(`${API_URL}?action=user&walletAddress=${WALLET_ADDRESS}`);
    const userData = await response.json();
    
    console.log(`User has ${userData.transactions?.length || 0} transactions`);
    
    if (!userData.transactions || userData.transactions.length === 0) {
      console.log("No transactions found for user");
      return;
    }
    
    // Print all transactions
    console.log("\nUser transactions:");
    userData.transactions.forEach((tx, index) => {
      console.log(`[${index}] Hash: ${tx.hash}, HashKey: ${tx.hashKey}`);
    });
    
    // Step 2: Try to verify the most recent hash
    const latestTx = userData.transactions[0];
    console.log("\nStep 2: Verifying the most recent hash...");
    console.log(`Hash: ${latestTx.hash}`);
    console.log(`HashKey: ${latestTx.hashKey}`);
    
    const verifyResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        providerId: "provider1",
        hash: latestTx.hash,
        hashKey: latestTx.hashKey,
        walletAddress: WALLET_ADDRESS,
        chain: "WORLD"
      })
    });
    
    const verifyResult = await verifyResponse.json();
    console.log("Verify response:", JSON.stringify(verifyResult, null, 2));
    
    // Step 3: Test URL encoding and decoding
    if (latestTx.hashKey) {
      console.log("\nStep 3: Testing URL encoding/decoding of hashKey...");
      
      const encodedHashKey = encodeURIComponent(latestTx.hashKey);
      console.log(`Encoded hashKey: ${encodedHashKey}`);
      
      const decodedHashKey = decodeURIComponent(encodedHashKey);
      console.log(`Decoded hashKey: ${decodedHashKey}`);
      console.log(`Original equals decoded: ${latestTx.hashKey === decodedHashKey}`);
      
      // Verify with decoded hashKey
      const verifyResponse2 = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          providerId: "provider1",
          hash: latestTx.hash,
          hashKey: decodedHashKey,
          walletAddress: WALLET_ADDRESS,
          chain: "WORLD"
        })
      });
      
      const verifyResult2 = await verifyResponse2.json();
      console.log("Verify response with decoded hashKey:", JSON.stringify(verifyResult2, null, 2));
    }
    
  } catch (error) {
    console.error("Error during test:", error);
  }
}

// Run the test
testUserHashes(); 