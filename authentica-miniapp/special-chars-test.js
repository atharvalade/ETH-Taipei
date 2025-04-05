// SPECIAL CHARACTERS TEST
// This test focuses on content with special characters to test URL handling

const API_URL = 'https://ipfs-api1-ethtaipei.vercel.app/api/authentica';

async function testSpecialCharacters() {
  console.log('--------------- SPECIAL CHARACTERS TEST ---------------');
  console.log('Testing verification flow with special characters');
  console.log('----------------------------------------------------\n');

  try {
    // STEP 1: Submit content with special characters
    console.log('STEP 1: User submits content with special characters');
    const walletAddress = '0xSpecialCharsTest+#&?=';
    const content = 'Test content with special characters: +&?=%#$@!*(){}[]| 😀 \n\t "quoted" \'single\' `backtick`';
    
    console.log(`Content: "${content}"`);
    console.log(`Wallet address: ${walletAddress}`);
    
    // STEP 2: Submit content to API and get hash and hashKey
    console.log('\nSTEP 2: Storing content through API');
    const submitResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, walletAddress })
    });
    
    if (!submitResponse.ok) {
      throw new Error(`API Error: ${submitResponse.status} ${submitResponse.statusText}`);
    }
    
    const submitData = await submitResponse.json();
    console.log('API Response:', submitData);
    
    if (!submitData.success) {
      throw new Error('API reported failure');
    }
    
    const { hash, hashKey } = submitData;
    console.log(`Hash: ${hash}`);
    console.log(`HashKey: ${hashKey}`);
    
    // STEP 3: Create URL for result page - NO ENCODING
    console.log('\nSTEP 3: Navigating to result page (NO ENCODING)');
    const verificationId = `test-${Date.now()}`;
    const url = `/result?id=${verificationId}&hash=${hash}&hashKey=${hashKey}&wallet=${walletAddress}`;
    console.log(`Navigation URL: ${url}`);
    
    // STEP 4: Extract parameters from URL
    console.log('\nSTEP 4: URL parameters extraction (as Next.js would do)');
    const urlObj = new URL(`http://example.com${url}`);
    const params = urlObj.searchParams;
    
    const extractedId = params.get('id');
    const extractedHash = params.get('hash');
    const extractedHashKey = params.get('hashKey');
    const extractedWallet = params.get('wallet');
    
    console.log('Extracted parameters:');
    console.log(`- ID: ${extractedId}`);
    console.log(`- Hash: ${extractedHash}`);
    console.log(`- HashKey: ${extractedHashKey}`);
    console.log(`- Wallet: ${extractedWallet}`);
    
    // Parameter validation
    console.log('\nValidating Parameters:');
    console.log(`Hash matches: ${hash === extractedHash ? 'YES ✓' : 'NO ✗'}`);
    console.log(`HashKey matches: ${hashKey === extractedHashKey ? 'YES ✓' : 'NO ✗'}`);
    console.log(`Wallet matches: ${walletAddress === extractedWallet ? 'YES ✓' : 'NO ✗'}`);
    
    // STEP 5: Verify the content using the extracted parameters
    console.log('\nSTEP 5: Verifying content with extracted parameters');
    const verifyResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        providerId: 'provider1',
        hash: extractedHash,
        hashKey: extractedHashKey,
        walletAddress: extractedWallet,
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
    console.log('Special characters test completed');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error);
  }
}

// Run the test
testSpecialCharacters(); 