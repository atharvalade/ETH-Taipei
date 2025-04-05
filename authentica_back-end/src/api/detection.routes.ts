import express from 'express';
import { getVerificationFromProvider } from '../services/ai-detection.service';
import { getContentFromIPFS } from '../services/user.service';
import { updateVerificationResult } from '../services/user.service';

const router = express.Router();

// Verify content with a specific provider
router.post('/verify', async (req, res) => {
  try {
    const { providerId, hash, hashKey, walletAddress, chain } = req.body;
    
    if (!providerId || !hash || !hashKey || !walletAddress || !chain) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate chain value
    if (chain !== 'WORLD' && chain !== 'ROOTSTOCK') {
      return res.status(400).json({ message: 'Invalid chain value. Must be WORLD or ROOTSTOCK' });
    }
    
    // Get verification result from provider
    const result = await getVerificationFromProvider(providerId, hash, hashKey);
    
    // Update user's verification history
    await updateVerificationResult(walletAddress, hash, {
      isHumanWritten: result.isHumanWritten,
      confidenceScore: result.confidenceScore,
      provider: providerId,
      chain
    });
    
    // Return verification result
    res.json({
      isHumanWritten: result.isHumanWritten,
      confidenceScore: result.confidenceScore,
      provider: providerId,
      chain,
      hash,
      hashKey
    });
  } catch (error) {
    console.error('Error in verification:', error);
    res.status(500).json({ message: 'Failed to verify content' });
  }
});

// Get content to verify
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

export default router; 