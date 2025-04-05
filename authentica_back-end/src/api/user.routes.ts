import express from 'express';
import {
  getOrCreateUser,
  storeContentToIPFS,
  getContentFromIPFS,
  updateVerificationResult,
  updateNftTokenId,
  getUserTransactionHistory
} from '../services/user.service';

const router = express.Router();

// Get user data
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    const user = await getOrCreateUser(walletAddress);
    const transactions = await getUserTransactionHistory(walletAddress);
    
    res.json({
      walletAddress: user.walletAddress,
      username: user.username,
      isWorldIdVerified: user.isWorldIdVerified,
      verificationCount: user.verificationCount,
      transactions
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// Store content to IPFS
router.post('/store-content', async (req, res) => {
  try {
    const { walletAddress, content } = req.body;
    
    if (!walletAddress || !content) {
      return res.status(400).json({ message: 'Wallet address and content are required' });
    }
    
    const { hash, hashKey } = await storeContentToIPFS(walletAddress, content);
    
    res.status(201).json({
      hash,
      hashKey,
      message: 'Content stored successfully'
    });
  } catch (error) {
    console.error('Error storing content:', error);
    res.status(500).json({ message: 'Failed to store content' });
  }
});

// Get content from IPFS
router.get('/content/:hash/:hashKey', async (req, res) => {
  try {
    const { hash, hashKey } = req.params;
    
    if (!hash || !hashKey) {
      return res.status(400).json({ message: 'Hash and hashKey are required' });
    }
    
    const content = await getContentFromIPFS(hash, hashKey);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found or invalid hash key' });
    }
    
    res.json({ content });
  } catch (error) {
    console.error('Error retrieving content:', error);
    res.status(500).json({ message: 'Failed to retrieve content' });
  }
});

// Update verification result
router.post('/update-verification', async (req, res) => {
  try {
    const { walletAddress, hash, result, transactionHash } = req.body;
    
    if (!walletAddress || !hash || !result) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    await updateVerificationResult(walletAddress, hash, result, transactionHash);
    
    res.json({ message: 'Verification result updated successfully' });
  } catch (error) {
    console.error('Error updating verification result:', error);
    res.status(500).json({ message: 'Failed to update verification result' });
  }
});

// Update NFT token ID
router.post('/update-nft', async (req, res) => {
  try {
    const { walletAddress, hash, nftTokenId } = req.body;
    
    if (!walletAddress || !hash || !nftTokenId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    await updateNftTokenId(walletAddress, hash, nftTokenId);
    
    res.json({ message: 'NFT token ID updated successfully' });
  } catch (error) {
    console.error('Error updating NFT token ID:', error);
    res.status(500).json({ message: 'Failed to update NFT token ID' });
  }
});

export default router; 