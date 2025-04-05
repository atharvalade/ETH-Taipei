// API endpoint to submit content for verification
import { storeOnIPFS, contentStorage, users } from './authentica';
import crypto from 'crypto';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

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