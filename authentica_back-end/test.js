// Simple test script for end-to-end testing

const crypto = require('crypto');

// Simulate content storage
function storeContent(content) {
  // Generate a hash (in a real implementation, this would be from IPFS)
  const hash = 'Qm' + crypto.randomBytes(32).toString('hex').substring(0, 44);
  const hashKey = crypto.randomBytes(16).toString('hex');
  
  console.log('Content stored successfully:');
  console.log('Hash:', hash);
  console.log('HashKey:', hashKey);
  
  return { hash, hashKey };
}

// Simulate content verification
function verifyContent(hash, hashKey, providerId = 'provider1') {
  // Simulate different providers with different behaviors
  let isHumanWritten, confidenceScore;
  
  switch(providerId) {
    case 'provider1':
      // RealText Systems - high accuracy for technical content
      isHumanWritten = true;
      confidenceScore = 0.97;
      break;
    case 'provider2':
      // VerifyAI Labs - specialized in academic content
      isHumanWritten = Math.random() > 0.3;
      confidenceScore = isHumanWritten ? 0.95 + (Math.random() * 0.04) : 0.70 + (Math.random() * 0.20);
      break;
    case 'provider3':
      // TrueContent - for news articles
      isHumanWritten = Math.random() > 0.4;
      confidenceScore = isHumanWritten ? 0.93 + (Math.random() * 0.06) : 0.65 + (Math.random() * 0.25);
      break;
    case 'provider4':
      // AuthentiCheck - for creative writing
      isHumanWritten = Math.random() > 0.5;
      confidenceScore = isHumanWritten ? 0.90 + (Math.random() * 0.09) : 0.60 + (Math.random() * 0.25);
      break;
    default:
      isHumanWritten = Math.random() > 0.5;
      confidenceScore = isHumanWritten ? 0.90 + (Math.random() * 0.09) : 0.60 + (Math.random() * 0.30);
  }
  
  // For testing purposes, force specific results for certain providers
  if (providerId === 'provider3' && hash.startsWith('Qm')) {
    isHumanWritten = false;
    confidenceScore = 0.88;
  }
  
  if (providerId === 'provider4' && hash.startsWith('Qm')) {
    isHumanWritten = true;
    confidenceScore = 0.94; // Just below the threshold for NFT minting
  }
  
  console.log('\nVerification result:');
  console.log('Provider:', providerId);
  console.log('Is human-written:', isHumanWritten);
  console.log('Confidence score:', confidenceScore.toFixed(2));
  
  return { isHumanWritten, confidenceScore };
}

// Simulate NFT minting
function mintNFT(hash, hashKey, walletAddress) {
  const tokenId = 'AUTH-' + Math.floor(Math.random() * 1000000);
  
  console.log('\nNFT minted successfully:');
  console.log('Token ID:', tokenId);
  console.log('Owner:', walletAddress);
  
  return { tokenId };
}

// Run the full flow
function runTest() {
  console.log('AUTHENTICA API TEST\n');
  
  // Sample content that looks human-written but confidence might be low
  const content = `I wrote this text myself to test blockchain verification. 
The technology seems promising but I'm not sure about all the details yet.
Maybe it will become more mainstream in the future? Who knows!`;
  
  console.log('Content to verify:', content, '\n');
  
  // Step 1: Store content
  const { hash, hashKey } = storeContent(content);
  
  // Step 2: Verify content
  const providerId = 'provider4'; // Using provider4 for creative writing
  const { isHumanWritten, confidenceScore } = verifyContent(hash, hashKey, providerId);
  
  // Step 3: Mint NFT if human-written with high confidence
  if (isHumanWritten && confidenceScore > 0.95) {
    const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
    const { tokenId } = mintNFT(hash, hashKey, walletAddress);
    
    console.log('\nVerification flow completed successfully!');
    console.log('Content can now be verified on-chain using the NFT.');
  } else {
    console.log('\nNFT minting not available:');
    if (!isHumanWritten) {
      console.log('- Content was identified as AI-generated');
    } else if (confidenceScore <= 0.95) {
      console.log('- Confidence score too low (must be >95%)');
    }
  }
}

// Run the test
runTest(); 