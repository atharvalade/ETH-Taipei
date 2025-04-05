// Test script for the miniapp's submit-content API endpoint with AI-generated content

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
  
  // Simulate verification result
  let isHumanWritten, confidenceScore;
  
  if (providerId === 'provider1') {
    isHumanWritten = true;
    confidenceScore = 0.97;
  } else if (providerId === 'provider2') {
    isHumanWritten = Math.random() > 0.3;
    confidenceScore = isHumanWritten ? 0.95 + (Math.random() * 0.04) : 0.70 + (Math.random() * 0.20);
  } else if (providerId === 'provider3') {
    isHumanWritten = false; // Always AI for provider3 in test
    confidenceScore = 0.88;
  } else if (providerId === 'provider4') {
    isHumanWritten = true; // Always human but low confidence
    confidenceScore = 0.94;
  } else {
    isHumanWritten = Math.random() > 0.5;
    confidenceScore = isHumanWritten ? 0.90 + (Math.random() * 0.09) : 0.60 + (Math.random() * 0.30);
  }
  
  // For this test, force AI detection
  if (providerId === 'provider3') {
    isHumanWritten = false;
    confidenceScore = 0.88;
  }
  
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
  console.log('AUTHENTICA MINIAPP API TEST (AI CONTENT)\n');
  
  // Test parameters with text that looks AI-generated
  const content = `As an AI language model, I can provide a comprehensive overview of blockchain technology. 
Blockchain is a decentralized digital ledger that records transactions across multiple computers. 
The use of cryptographic hashing ensures data integrity, while consensus mechanisms validate transactions. 
Smart contracts enable automated execution of agreements when predefined conditions are met.`;
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const providerId = 'provider3';
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