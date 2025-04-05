// Test script for the miniapp's submit-content API endpoint with human content but low confidence

const sendContentToApi = async (content, walletAddress) => {
  console.log(`Sending content to API...`);
  console.log(`Content: "${content.substring(0, 50)}..."`);
  console.log(`Wallet Address: ${walletAddress}`);
  
  // In a real implementation, this would make an HTTP request to:
  // POST /api/submit-content
  
  // For testing purposes, simulate the API response
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  // Generate mock hash and hashKey
  const hash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const hashKey = Math.random().toString(36).substring(2, 34);
  
  console.log('\nAPI Response:');
  console.log('Status: Success');
  console.log('Hash:', hash);
  console.log('HashKey:', hashKey);
  
  return { success: true, hash, hashKey };
};

const verifyContentUsingApi = async (hash, hashKey, providerId, walletAddress, chain) => {
  console.log(`\nSending verification request to API...`);
  console.log(`Hash: ${hash}`);
  console.log(`Provider ID: ${providerId}`);
  console.log(`Chain: ${chain}`);
  
  // In a real implementation, this would make an HTTP request to:
  // POST /api/verify-content
  
  // For testing purposes, simulate the API response
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  
  // Simulate verification result - for this test, always use low confidence
  const isHumanWritten = true;
  const confidenceScore = 0.94; // Below 95% threshold
  
  console.log('\nVerification API Response:');
  console.log('Status: Success');
  console.log('Provider:', providerId);
  console.log('Is human-written:', isHumanWritten);
  console.log('Confidence score:', confidenceScore.toFixed(2));
  
  return { 
    success: true, 
    result: {
      isHumanWritten,
      confidenceScore,
      provider: providerId,
      chain,
      hash,
      hashKey
    }
  };
};

const testMiniappFlow = async () => {
  console.log('AUTHENTICA MINIAPP API TEST (LOW CONFIDENCE)\n');
  
  // Test parameters with human-written but potentially ambiguous text
  const content = `I wrote this text myself to test blockchain verification. 
The technology seems promising but I'm not sure about all the details yet.
Maybe it will become more mainstream in the future? Who knows!`;
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const providerId = 'provider4';
  const chain = 'WORLD';
  
  try {
    // Step 1: Submit content
    const { hash, hashKey } = await sendContentToApi(content, walletAddress);
    
    // Step 2: Verify content
    const verificationResult = await verifyContentUsingApi(hash, hashKey, providerId, walletAddress, chain);
    
    // Step 3: Check if eligible for NFT minting
    if (verificationResult.result.isHumanWritten && verificationResult.result.confidenceScore > 0.95) {
      console.log('\nEligible for NFT minting:');
      console.log('- Content verified as human-written');
      console.log('- Confidence score above 95%');
      
      // In a real flow, this would call the API to mint an NFT
      console.log('\nMinting NFT...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('NFT minted successfully!');
      console.log('Token ID: AUTH-' + Math.floor(Math.random() * 1000000));
    } else {
      console.log('\nNot eligible for NFT minting:');
      if (!verificationResult.result.isHumanWritten) {
        console.log('- Content was identified as AI-generated');
      } else if (verificationResult.result.confidenceScore <= 0.95) {
        console.log('- Confidence score too low (must be >95%)');
      }
    }
    
    console.log('\nTest completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  }
};

// Run the test
testMiniappFlow(); 