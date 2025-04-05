// DIRECT API TEST
// This test bypasses the frontend entirely and tests the API directly

const API_URL = 'https://ipfs-api1-ethtaipei.vercel.app/api/authentica';

async function testDirectAPI() {
  console.log('------------------ DIRECT API TEST ------------------');
  console.log('Testing API directly without any frontend components');
  console.log('----------------------------------------------------\n');

  try {
    // STEP 1: Store content
    console.log('STEP 1: Storing content directly via API');
    const walletAddress = '0xDirectAPITest';
    const content = 'Test content for direct API test';
    
    console.log(`Content: "${content}"`);
    console.log(`Wallet address: ${walletAddress}`);
    
    const storeResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, walletAddress })
    });
    
    const storeData = await storeResponse.json();
    console.log('API Response:', storeData);
    
    if (!storeData.success) {
      throw new Error('API reported failure on content storage');
    }
    
    const { hash, hashKey } = storeData;
    console.log(`Hash: ${hash}`);
    console.log(`HashKey: ${hashKey}`);
    
    // STEP 2: Verify content
    console.log('\nSTEP 2: Verifying content directly via API');
    const verifyResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        providerId: 'provider1',
        hash,
        hashKey,
        walletAddress,
        chain: 'WORLD'
      })
    });
    
    const verifyData = await verifyResponse.json();
    console.log('Verification Response:', JSON.stringify(verifyData, null, 2));
    
    if (verifyData.success) {
      console.log('\n✅ VERIFICATION SUCCESSFUL!');
      console.log(`Human-Written: ${verifyData.result.isHumanWritten}`);
      console.log(`Confidence: ${verifyData.result.confidenceScore}`);
      console.log(`Provider: ${verifyData.result.provider}`);
    } else {
      console.log('\n❌ VERIFICATION FAILED!');
      console.log(`Error: ${verifyData.error}`);
    }
    
    console.log('\n----------------------------------------------------');
    console.log('Direct API test completed');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error);
  }
}

// Run the test
testDirectAPI(); 