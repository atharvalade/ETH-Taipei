// Consolidated Authentica API for Vercel deployment
import crypto from 'crypto';
// Using native fetch in Next.js
import { Buffer } from 'buffer';

// Keep in-memory backup/cache for better performance
const contentStorage = new Map();

// Pinata IPFS Configuration - Use environment variables
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;

// Function to store content on IPFS via Pinata
async function storeOnIPFS(content) {
  console.log("📤 Attempting to store content on IPFS via Pinata...");
  try {
    // First attempt - try direct JSON upload
    try {
      console.log("📦 Preparing content for Pinata JSON upload");
      // Data to be pinned
      const jsonData = {
        content,
        timestamp: new Date().toISOString(),
        app: 'authentica',
        type: 'content-verification'
      };
      
      // Send request to Pinata pinJSONToIPFS endpoint
      console.log("📡 Sending request to Pinata pinJSONToIPFS endpoint");
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pinataContent: jsonData,
          pinataMetadata: {
            name: `authentica-content-${Date.now()}`
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Pinata JSON upload failed: ${errorText}`);
        throw new Error(`Error storing on IPFS: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Content successfully uploaded to IPFS with hash: ${data.IpfsHash}`);
      return data.IpfsHash; // Return the IPFS hash (CID)
    } catch (jsonError) {
      console.error('⚠️ Failed to pin JSON, trying alternative method:', jsonError);
      
      // Alternative method - use URLSearchParams for form data
      console.log("📦 Preparing content for alternative upload method");
      const formData = new URLSearchParams();
      
      // Convert content to JSON string
      const contentJson = JSON.stringify({
        content,
        timestamp: new Date().toISOString()
      });
      
      formData.append('file', contentJson);
      formData.append('pinataMetadata', JSON.stringify({
        name: `authentica-content-${Date.now()}`
      }));
      
      // Send request to Pinata
      console.log("📡 Sending request to Pinata pinFileToIPFS endpoint");
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Pinata file upload failed: ${errorText}`);
        throw new Error(`Error storing on IPFS (alternative method): ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Content successfully uploaded to IPFS with hash: ${data.IpfsHash} (alternative method)`);
      return data.IpfsHash; // Return the IPFS hash (CID)
    }
  } catch (error) {
    console.error('❌ IPFS storage error:', error);
    throw error;
  }
}

// Function to retrieve content from IPFS via Pinata Gateway
async function getFromIPFS(hash) {
  console.log(`📥 Attempting to retrieve content from IPFS with hash: ${hash}`);
  try {
    // Check local cache first
    if (contentStorage.has(hash)) {
      console.log("📋 Content found in local cache");
      return contentStorage.get(hash);
    }
    
    // If not in cache, retrieve from IPFS gateway
    console.log(`📡 Fetching from Pinata gateway: ${hash}`);
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
    
    if (!response.ok) {
      console.error(`❌ IPFS retrieval failed: ${response.statusText}`);
      throw new Error(`Error retrieving from IPFS: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("✅ Content successfully retrieved from IPFS");
    
    // Store in cache for future requests
    contentStorage.set(hash, data);
    return data;
  } catch (error) {
    console.error('❌ IPFS retrieval error:', error);
    throw error;
  }
}

// AI Detection algorithms
const detectAIByPatterns = (text) => {
  // Ensure text is a string
  if (typeof text !== 'string') {
    console.log("⚠️ Non-string input to detectAIByPatterns, converting:", text);
    text = String(text);
  }

  // Simple pattern-based detection
  const aiPatterns = [
    /as an ai language model/i,
    /i don't have personal/i,
    /i cannot provide/i,
    /i apologize, but i cannot/i
  ];
  
  let patternMatches = 0;
  aiPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      patternMatches++;
    }
  });
  
  // Check for formulaic structures
  const hasFormulaic = /firstly[\s\S]*secondly[\s\S]*finally/i.test(text);
  
  // Calculate AI score
  let aiScore = 0;
  aiScore += patternMatches * 0.15;
  if (hasFormulaic) aiScore += 0.2;
  
  // Add some randomness for demo
  aiScore += (Math.random() * 0.3) - 0.15;
  aiScore = Math.max(0, Math.min(1, aiScore));
  
  // Convert to human score
  const humanScore = 1 - aiScore;
  return {
    isHumanWritten: humanScore > 0.5,
    confidenceScore: humanScore
  };
};

const detectAIByStatistics = (text) => {
  // Ensure text is a string
  if (typeof text !== 'string') {
    console.log("⚠️ Non-string input to detectAIByStatistics, converting:", text);
    text = String(text);
  }

  try {
    // Calculate text statistics
    const wordCount = text.split(/\s+/).length || 1; // Avoid division by zero
    const charCount = text.length;
    const sentences = text.split(/[.!?]+\s/) || [''];
    const sentenceCount = sentences.length || 1; // Avoid division by zero
    
    // Calculate averages
    const avgWordLength = charCount / wordCount;
    const avgSentenceLength = wordCount / sentenceCount;
    
    // Calculate sentence variance
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / (sentenceLengths.length || 1);
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / (sentenceLengths.length || 1);
    const stdDev = Math.sqrt(variance);
    
    // Calculate AI score
    let aiScore = 0;
    
    // If standard deviation is low, likely AI-generated
    if (stdDev < 2) aiScore += 0.3;
    
    // Check average word length
    if (avgWordLength > 5.8) aiScore += 0.2;
    
    // Check consistent sentence length
    if (avgSentenceLength > 20 && stdDev < 3) aiScore += 0.2;
    
    // Add randomness for demo
    aiScore += (Math.random() * 0.3) - 0.15;
    aiScore = Math.max(0, Math.min(1, aiScore));
    
    // Convert to human score
    const humanScore = 1 - aiScore;
    return {
      isHumanWritten: humanScore > 0.5,
      confidenceScore: humanScore
    };
  } catch (error) {
    console.error("❌ Error in detectAIByStatistics:", error);
    // Default fallback in case of any errors
    return {
      isHumanWritten: true,
      confidenceScore: 0.5
    };
  }
};

// Get verification based on provider
const getVerificationFromProvider = (content, providerId) => {
  // Make sure content is a string - it might be an object from IPFS
  const contentString = typeof content === 'string' ? content : 
                        typeof content === 'object' && content.content ? content.content :
                        JSON.stringify(content);
                        
  switch(providerId) {
    case 'provider1': // RealText Systems
      return { isHumanWritten: true, confidenceScore: 0.97 };
    
    case 'provider2': // VerifyAI Labs
      return detectAIByPatterns(contentString);
    
    case 'provider3': // TrueContent
      if (contentString.toLowerCase().includes('as an ai language model')) {
        return { isHumanWritten: false, confidenceScore: 0.88 };
      }
      return detectAIByStatistics(contentString);
    
    case 'provider4': // AuthentiCheck
      // Creative writing with low confidence
      return { isHumanWritten: true, confidenceScore: 0.94 };
    
    default:
      return detectAIByStatistics(contentString);
  }
};

// User data storage
const users = new Map();

export default async function handler(req, res) {
  console.log("🚀 Authentica API called with URL:", req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    console.log("🚀 OPTIONS request received");
    return res.status(200).end();
  }
  
  // Parse the route from the URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  console.log("📍 Parsed URL pathname:", pathname);
  
  // For the base endpoint, we'll determine the action based on the request method and body
  if (pathname === '/api/authentica') {
    if (req.method === 'POST') {
      // Check if action is specified in the request body
      const { action } = req.body;
      console.log(`🔀 Action specified in request body: ${action}`);
      
      if (action === 'verify') {
        console.log("🔍 Handling verify request from action parameter");
        return handleVerifyAction(req, res);
      } else if (action === 'update-nft') {
        console.log("🔄 Handling update-nft request from action parameter");
        return handleUpdateNFTAction(req, res);
      } else {
        // Default action if none specified is 'store-content'
        console.log("📝 Handling store-content request (default action)");
        return handleStoreContent(req, res);
      }
    } else if (req.method === 'GET' && req.query.action === 'user') {
      console.log("👤 Handling user data request from action parameter");
      const walletAddress = req.query.walletAddress;
      return handleGetUserData(walletAddress, res);
    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed on base route'
      });
    }
  }
  
  // For specific routes with paths, we'll use the traditional routing
  const route = pathname.replace('/api/authentica', '');
  console.log("🔀 Route after prefix removal:", route);
  
  // Route: Store content
  if (route === '/store-content' && req.method === 'POST') {
    console.log("📝 Handling store-content request from path");
    return handleStoreContent(req, res);
  }
  
  // Route: Verify content
  else if (route === '/verify' && req.method === 'POST') {
    console.log("🔍 Handling verify request from path");
    return handleVerifyAction(req, res);
  }
  
  // Route: Update NFT
  else if (route === '/update-nft' && req.method === 'POST') {
    console.log("🔄 Handling update-nft request from path");
    return handleUpdateNFTAction(req, res);
  }
  
  // Route: Get user data
  else if (route.match(/^\/user\//) && req.method === 'GET') {
    console.log("👤 Handling user data request from path");
    const walletAddress = route.replace('/user/', '');
    return handleGetUserData(walletAddress, res);
  }
  
  // Invalid route
  else {
    console.log("❌ Invalid route requested:", route);
    return res.status(404).json({ 
      success: false, 
      error: 'API route not found' 
    });
  }
}

// Verify content action handler
function handleVerifyAction(req, res) {
  try {
    const { providerId, hash, hashKey, walletAddress, chain } = req.body;
    console.log(`🔍 Verifying content with hash: ${hash}, provider: ${providerId}`);
    
    if (!providerId || !hash || !hashKey || !walletAddress || !chain) {
      console.error("❌ Missing required fields for verification");
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields for verification' 
      });
    }
    
    // Validate chain
    if (chain !== 'WORLD' && chain !== 'ROOTSTOCK') {
      console.error(`❌ Invalid chain value: ${chain}`);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid chain value' 
      });
    }
    
    // Get content - try IPFS first, then local cache
    let storedData;
    try {
      storedData = getFromIPFS(hash);
      console.log(`✅ Successfully retrieved content from IPFS`);
    } catch (ipfsError) {
      console.error('Failed to retrieve from IPFS, checking local cache:', ipfsError);
      storedData = contentStorage.get(hash);
      if (storedData) {
        console.log(`✅ Found content in local cache`);
      }
    }
    
    if (!storedData) {
      console.error(`❌ Content not found for hash: ${hash}`);
      return res.status(404).json({ 
        success: false, 
        error: 'Content not found' 
      });
    }
    
    // Validate hashKey - need to ensure hashKey is still accessible
    const userRecord = users.get(walletAddress);
    const hashEntry = userRecord?.ipfsHashes.find(entry => entry.hash === hash);
    
    if (!hashEntry || hashEntry.hashKey !== hashKey) {
      console.error(`❌ Invalid hash key for hash: ${hash}`);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid hash key' 
      });
    }
    
    // Get verification result
    console.log(`🧠 Running AI detection with provider: ${providerId}`);
    const result = getVerificationFromProvider(storedData.content || storedData, providerId);
    console.log(`✅ Verification result: ${JSON.stringify(result)}`);
    
    // Update user record
    if (users.has(walletAddress)) {
      const user = users.get(walletAddress);
      const hashEntry = user.ipfsHashes.find(entry => entry.hash === hash);
      
      if (hashEntry) {
        hashEntry.result = {
          isHumanWritten: result.isHumanWritten,
          confidenceScore: result.confidenceScore,
          provider: providerId,
          chain
        };
        
        user.verificationCount += 1;
        console.log(`📊 Updated user verification count to: ${user.verificationCount}`);
      }
    }
    
    console.log(`🎉 Verification completed successfully`);
    return res.status(200).json({
      success: true,
      result: {
        isHumanWritten: result.isHumanWritten,
        confidenceScore: result.confidenceScore,
        provider: providerId,
        chain,
        hash,
        hashKey
      }
    });
  } catch (error) {
    console.error('❌ Error verifying content:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error during verification' 
    });
  }
}

// Update NFT action handler
function handleUpdateNFTAction(req, res) {
  try {
    const { walletAddress, hash, nftTokenId } = req.body;
    console.log(`🔄 Updating NFT token ID for hash: ${hash}`);
    
    if (!walletAddress || !hash || !nftTokenId) {
      console.error("❌ Missing required fields for NFT update");
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    // Update user record
    if (users.has(walletAddress)) {
      const user = users.get(walletAddress);
      const hashEntry = user.ipfsHashes.find(entry => entry.hash === hash);
      
      if (hashEntry) {
        hashEntry.nftTokenId = nftTokenId;
        console.log(`✅ Updated NFT token ID to: ${nftTokenId}`);
      } else {
        console.error(`❌ Hash not found for user: ${hash}`);
        return res.status(404).json({ 
          success: false, 
          error: 'Hash not found for user' 
        });
      }
    } else {
      console.error(`❌ User not found: ${walletAddress}`);
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    console.log(`🎉 NFT token ID updated successfully`);
    return res.status(200).json({
      success: true,
      message: 'NFT token ID updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating NFT token ID:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error updating NFT token ID' 
    });
  }
}

// Get user data handler
function handleGetUserData(walletAddress, res) {
  try {
    console.log(`👤 Getting data for user with wallet: ${walletAddress}`);
    
    if (!walletAddress) {
      console.error("❌ Wallet address is required");
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address is required' 
      });
    }
    
    if (!users.has(walletAddress)) {
      console.log(`👤 Creating new user record for wallet: ${walletAddress}`);
      // Create new user if not exists
      users.set(walletAddress, {
        walletAddress,
        verificationCount: 0,
        ipfsHashes: []
      });
    }
    
    const user = users.get(walletAddress);
    console.log(`✅ User data retrieved successfully`);
    
    return res.status(200).json({
      success: true,
      walletAddress: user.walletAddress,
      verificationCount: user.verificationCount,
      transactions: user.ipfsHashes.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
    });
  } catch (error) {
    console.error('❌ Error fetching user data:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error fetching user data' 
    });
  }
}

// Extracted handler for store-content to avoid code duplication
async function handleStoreContent(req, res) {
  try {
    const { content, walletAddress } = req.body;
    console.log(`📦 Received content submission from wallet: ${walletAddress}`);
    
    if (!content || !walletAddress) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ 
        success: false, 
        error: 'Content and wallet address are required' 
      });
    }
    
    // Generate hashKey
    const hashKey = crypto.randomBytes(16).toString('hex');
    console.log(`🔑 Generated hash key: ${hashKey}`);
    
    // Store content on IPFS
    let ipfsHash;
    try {
      ipfsHash = await storeOnIPFS(content);
      console.log(`📤 Successfully stored on IPFS with hash: ${ipfsHash}`);
    } catch (ipfsError) {
      console.error('Failed to store on IPFS, falling back to in-memory storage:', ipfsError);
      // Fallback to in-memory if IPFS fails
      ipfsHash = 'Qm' + crypto.randomBytes(16).toString('hex');
      contentStorage.set(ipfsHash, {
        content,
        hashKey,
        timestamp: new Date().toISOString()
      });
      console.log(`📦 Fallback to in-memory storage with hash: ${ipfsHash}`);
    }
    
    // Initialize user if not exists
    if (!users.has(walletAddress)) {
      console.log(`👤 Creating new user record for wallet: ${walletAddress}`);
      users.set(walletAddress, {
        walletAddress,
        verificationCount: 0,
        ipfsHashes: []
      });
    }
    
    // Add hash to user's record
    const user = users.get(walletAddress);
    user.ipfsHashes.push({
      hash: ipfsHash,
      hashKey,
      timestamp: new Date().toISOString()
    });
    console.log(`✅ Updated user record with new hash`);
    
    console.log(`🎉 Content submission successful`);
    return res.status(200).json({ 
      success: true, 
      hash: ipfsHash, 
      hashKey 
    });
  } catch (error) {
    console.error('❌ Error storing content:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error storing content' 
    });
  }
} 