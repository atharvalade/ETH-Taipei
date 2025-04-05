import express from 'express';
import { 
  processVerification, 
  getUserVerifications, 
  getVerificationById 
} from '../services/verification.service';

const router = express.Router();

// Request a new verification
router.post('/', async (req, res) => {
  try {
    const { userId, providerId, content, chain } = req.body;
    
    // Validate required fields
    if (!userId || !providerId || !content || !chain) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate chain value
    if (chain !== 'WORLD' && chain !== 'ROOTSTOCK') {
      return res.status(400).json({ message: 'Invalid chain value. Must be WORLD or ROOTSTOCK' });
    }
    
    const verification = await processVerification(userId, providerId, content, chain);
    res.status(201).json(verification);
  } catch (error) {
    console.error('Error creating verification:', error);
    res.status(500).json({ message: 'Failed to create verification' });
  }
});

// Get verifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const verifications = await getUserVerifications(req.params.userId);
    res.json(verifications);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    res.status(500).json({ message: 'Failed to fetch verifications' });
  }
});

// Get verification by ID
router.get('/:id', async (req, res) => {
  try {
    const verification = await getVerificationById(req.params.id);
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }
    res.json(verification);
  } catch (error) {
    console.error('Error fetching verification:', error);
    res.status(500).json({ message: 'Failed to fetch verification' });
  }
});

export default router; 