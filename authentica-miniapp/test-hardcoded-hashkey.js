// Test script with hardcoded hash and hashKey values

// Values obtained from previous curl test
const HASH = "QmW16iskG9uHUXng4sz7AJnWeBPfEaYE3xr8pwCytKBqXe";
const HASH_KEY = "4321f37e61073ae598f3520d6db414fe";
const WALLET_ADDRESS = "0xTest123";
const API_URL = "https://ipfs-api1-ethtaipei.vercel.app/api/authentica";

async function testVerification() {
  console.log("Testing verification with hardcoded values");
  console.log(`Hash: ${HASH}`);
  console.log(`HashKey: ${HASH_KEY}`);
  console.log(`Wallet Address: ${WALLET_ADDRESS}`);
  
  // Test 1: Direct verification
  try {
    console.log("\nTest 1: Direct verification with original hashKey");
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
    console.log("Response:", JSON.stringify(result1, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
  
  // Test 2: Encode and decode hashKey
  try {
    console.log("\nTest 2: Verification with encoded+decoded hashKey");
    
    // Simulate URL parameter process
    const encodedHashKey = encodeURIComponent(HASH_KEY);
    console.log(`Encoded hashKey: ${encodedHashKey}`);
    
    const decodedHashKey = decodeURIComponent(encodedHashKey);
    console.log(`Decoded hashKey: ${decodedHashKey}`);
    console.log(`Original equals decoded: ${HASH_KEY === decodedHashKey}`);
    
    // Verify with decoded hashKey
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
    console.log("Response:", JSON.stringify(result2, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
  
  // Test 3: Intentionally modified hashKey
  try {
    console.log("\nTest 3: Verification with incorrect hashKey");
    
    // Modify one character
    const modifiedHashKey = HASH_KEY.slice(0, -1) + "f";
    console.log(`Modified hashKey: ${modifiedHashKey}`);
    
    const response3 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        providerId: "provider1",
        hash: HASH,
        hashKey: modifiedHashKey,
        walletAddress: WALLET_ADDRESS,
        chain: "WORLD"
      })
    });
    
    const result3 = await response3.json();
    console.log("Response:", JSON.stringify(result3, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the test
testVerification(); 