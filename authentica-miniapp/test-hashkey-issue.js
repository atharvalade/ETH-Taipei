// Test script to diagnose hashKey encoding/decoding issues
// Using built-in fetch API (requires Node.js 18+)

const API_URL = 'https://ipfs-api1-ethtaipei.vercel.app/api/authentica';

/**
 * Test the full authentication flow with special characters in hashKey
 */
async function testHashKeyHandling() {
  console.log('Testing hashKey handling in authentica API\n');
  
  try {
    // Step 1: Store content to get hash and hashKey
    console.log('Step 1: Submitting content to get hash and hashKey...');
    const walletAddress = '0xTestWalletHashKey123';
    const content = 'This is test content for verification with special characters handling';
    
    const storeResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, walletAddress })
    });
    
    if (!storeResponse.ok) {
      throw new Error(`Failed to store content: ${storeResponse.statusText}`);
    }
    
    const storeData = await storeResponse.json();
    console.log('Store response:', storeData);
    
    // Extract hash and hashKey
    const { hash, hashKey } = storeData;
    console.log(`\nReceived hash: ${hash}`);
    console.log(`Received hashKey: ${hashKey}`);
    
    // Step 2: Simulate URL parameter handling
    console.log('\nStep 2: Simulating URL parameter handling...');
    
    // Encode the hashKey as it would be in the URL
    const encodedHashKey = encodeURIComponent(hashKey);
    console.log(`Encoded hashKey for URL: ${encodedHashKey}`);
    
    // Decode as it would happen in the result page
    const decodedHashKey = decodeURIComponent(encodedHashKey);
    console.log(`Decoded hashKey from URL: ${decodedHashKey}`);
    console.log(`Decoded matches original: ${decodedHashKey === hashKey ? 'YES ✓' : 'NO ✗'}`);
    
    // Step 3: Verify using original hashKey
    console.log('\nStep 3: Verifying with original hashKey...');
    await verifyContent(hash, hashKey, walletAddress, 'provider1');
    
    // Step 4: Verify using encoded+decoded hashKey
    console.log('\nStep 4: Verifying with encoded+decoded hashKey...');
    await verifyContent(hash, decodedHashKey, walletAddress, 'provider1');
    
    console.log('\nTest completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  }
}

/**
 * Verify content with the API
 */
async function verifyContent(hash, hashKey, walletAddress, providerId) {
  try {
    console.log(`Verifying content with hashKey: ${hashKey}`);
    
    const verifyResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        providerId,
        hash,
        hashKey,
        walletAddress,
        chain: 'WORLD'
      })
    });
    
    const verifyData = await verifyResponse.json();
    
    if (verifyData.success) {
      console.log('Verification successful!');
      console.log('Result:', JSON.stringify(verifyData.result, null, 2));
    } else {
      console.error('Verification failed:', verifyData.error);
    }
    
    return verifyData;
  } catch (error) {
    console.error('Error verifying content:', error);
    throw error;
  }
}

// Run the test
testHashKeyHandling();
