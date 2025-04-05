// Test script to determine if URL encoding/decoding is necessary

const HASH = "QmNsGRD2QRsAuQzMBivwgN9TX2mPqGRSXQWiKNjZbvCtk7";
const HASH_KEY = "d06692f95fdd0df95d4d6f0559369947";
const WALLET_ADDRESS = "0xTestSpecialChars";
const API_URL = "https://ipfs-api1-ethtaipei.vercel.app/api/authentica";

async function testEncodingNecessity() {
  console.log("Testing if URL encoding/decoding is necessary or causing issues");
  console.log(`Hash: ${HASH}`);
  console.log(`HashKey: ${HASH_KEY}`);
  console.log(`Wallet Address: ${WALLET_ADDRESS}`);
  
  // Test 1: Original hashKey (known to work with curl)
  try {
    console.log("\nTest 1: Using original hashKey directly");
    const response1 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        providerId: "provider1",
        hash: HASH,
        hashKey: HASH_KEY,
        walletAddress: WALLET_ADDRESS,
        chain: "WORLD"
      })
    });
    
    const result1 = await response1.json();
    console.log("Response (original):", JSON.stringify(result1, null, 2));
  } catch (error) {
    console.error("Error in Test 1:", error);
  }
  
  // Test 2: Simulate URL parameter handling
  try {
    console.log("\nTest 2: Simulating URL encoding/decoding (realistic scenario)");
    
    // This simulates what happens in the app:
    // 1. We get a hashKey from the API (e.g. d06692f95fdd0df95d4d6f0559369947)
    // 2. We put it in a URL parameter with encodeURIComponent
    // 3. Next.js gets it from the URL and we use decodeURIComponent
    // 4. We send it to the API
    
    const encodedHashKey = encodeURIComponent(HASH_KEY);
    console.log(`Encoded for URL: ${encodedHashKey}`);
    
    const decodedHashKey = decodeURIComponent(encodedHashKey);
    console.log(`Decoded from URL: ${decodedHashKey}`);
    console.log(`Original equals decoded: ${HASH_KEY === decodedHashKey}`);
    
    // Use the decoded value in API call
    const response2 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        providerId: "provider1",
        hash: HASH,
        hashKey: decodedHashKey,
        walletAddress: WALLET_ADDRESS,
        chain: "WORLD"
      })
    });
    
    const result2 = await response2.json();
    console.log("Response (decoded):", JSON.stringify(result2, null, 2));
  } catch (error) {
    console.error("Error in Test 2:", error);
  }
  
  // Test 3: Double encoding (possible issue - URL encoding twice)
  try {
    console.log("\nTest 3: Testing double encoding scenario (potential bug)");
    
    // This simulates a potential bug:
    // 1. We encode the hashKey with encodeURIComponent in verify/page.tsx
    // 2. The URL parameter is already encoded
    // 3. Next.js automatically decodes it once when getting from searchParams
    // 4. We manually decode again in result/page.tsx - potentially introducing errors
    
    const encodedHashKey = encodeURIComponent(HASH_KEY);
    // Simulate encoding twice and decoding twice
    const doubleEncodedHashKey = encodeURIComponent(encodedHashKey);
    console.log(`Double encoded: ${doubleEncodedHashKey}`);
    
    // First decode (like Next.js searchParams auto-decode)
    const onceDecodedHashKey = decodeURIComponent(doubleEncodedHashKey);
    console.log(`Once decoded: ${onceDecodedHashKey}`);
    
    // Second manual decode in result page
    const twiceDecodedHashKey = decodeURIComponent(onceDecodedHashKey);
    console.log(`Twice decoded: ${twiceDecodedHashKey}`);
    console.log(`Original equals twice decoded: ${HASH_KEY === twiceDecodedHashKey}`);
    
    // Use the twice decoded value in API call
    const response3 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        providerId: "provider1",
        hash: HASH,
        hashKey: twiceDecodedHashKey,
        walletAddress: WALLET_ADDRESS,
        chain: "WORLD"
      })
    });
    
    const result3 = await response3.json();
    console.log("Response (twice decoded):", JSON.stringify(result3, null, 2));
  } catch (error) {
    console.error("Error in Test 3:", error);
  }
}

// Run the test
testEncodingNecessity(); 