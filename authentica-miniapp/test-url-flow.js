// Test script to simulate URL parameter handling between pages

const API_URL = "https://ipfs-api1-ethtaipei.vercel.app/api/authentica";

async function testURLParameterFlow() {
  console.log("Testing URL parameter flow between verify and result pages\n");
  
  try {
    // Step 1: Store content to get hash and hashKey
    console.log("Step 1: Storing content to get hash and hashKey");
    const walletAddress = "0xTestURLFlow";
    const content = "Content for testing URL parameter flow";
    
    const storeResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, walletAddress })
    });
    
    if (!storeResponse.ok) {
      throw new Error(`Failed to store content: ${storeResponse.statusText}`);
    }
    
    const storeData = await storeResponse.json();
    console.log("Store response:", storeData);
    
    const { hash, hashKey } = storeData;
    console.log(`Hash: ${hash}`);
    console.log(`HashKey: ${hashKey}`);
    
    // Step 2: Simulate URL parameter creation (like in verify page)
    console.log("\nStep 2: Simulating URL parameter creation (verify page)");
    const mockVerificationId = `verify-${Math.random().toString(36).substring(2, 10)}`;
    
    // New approach: Using URLSearchParams
    const queryParams = new URLSearchParams();
    queryParams.set('id', mockVerificationId);
    queryParams.set('hash', hash);
    queryParams.set('hashKey', hashKey); // Let URLSearchParams handle encoding
    queryParams.set('wallet', walletAddress);
    
    const urlString = `/result?${queryParams.toString()}`;
    console.log(`Generated URL: ${urlString}`);
    
    // Parse URL parameters to simulate result page receiving them
    const fullUrl = new URL(`http://example.com${urlString}`);
    const searchParams = fullUrl.searchParams;
    
    // Extract parameters as result page would
    const id = searchParams.get('id') || '';
    const urlHash = searchParams.get('hash') || '';
    const urlHashKey = searchParams.get('hashKey') || '';
    const urlWallet = searchParams.get('wallet') || '';
    
    console.log("\nStep 3: Extracted URL parameters (result page)");
    console.log(`ID: ${id}`);
    console.log(`Hash: ${urlHash}`);
    console.log(`HashKey: ${urlHashKey}`);
    console.log(`Wallet: ${urlWallet}`);
    console.log(`Original HashKey equals URL HashKey: ${hashKey === urlHashKey ? 'YES ✓' : 'NO ✗'}`);
    
    // Step 4: Verify using the parameters from URL
    console.log("\nStep 4: Verifying with parameters extracted from URL");
    const verifyResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        providerId: "provider1",
        hash: urlHash,
        hashKey: urlHashKey, // Using hashKey as received from URL
        walletAddress: urlWallet,
        chain: "WORLD"
      })
    });
    
    if (!verifyResponse.ok) {
      throw new Error(`Verification failed with status: ${verifyResponse.status}`);
    }
    
    const verifyData = await verifyResponse.json();
    console.log("Verification result:", JSON.stringify(verifyData, null, 2));
    
    console.log("\nTest completed successfully ✅");
  } catch (error) {
    console.error("Error during test:", error);
  }
}

// Run the test
testURLParameterFlow(); 