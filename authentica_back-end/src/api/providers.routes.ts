import express from 'express';
import { 
  getActiveProviders, 
  getProviderById, 
  addProvider, 
  evaluateProviderAccuracy 
} from '../services/provider.service';
import { getProvidersWithStats } from '../services/verification.service';

const router = express.Router();

// Get all active providers with stats
router.get('/', async (req, res) => {
  try {
    const providers = await getProvidersWithStats();
    res.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ message: 'Failed to fetch providers' });
  }
});

// Get provider by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await getProviderById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.json(provider);
  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({ message: 'Failed to fetch provider' });
  }
});

// Add a new provider
router.post('/', async (req, res) => {
  try {
    const { name, description, apiEndpoint, apiKey, walletAddress, price, currency } = req.body;
    
    // Validate required fields
    if (!name || !description || !apiEndpoint || !apiKey || !walletAddress || !price || !currency) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const provider = await addProvider({
      name,
      description,
      apiEndpoint,
      apiKey,
      walletAddress,
      price,
      currency,
      isActive: true
    });
    
    // Evaluate provider accuracy
    const accuracyScore = await evaluateProviderAccuracy(provider._id.toString());
    provider.accuracyScore = accuracyScore;
    await provider.save();
    
    res.status(201).json(provider);
  } catch (error) {
    console.error('Error adding provider:', error);
    res.status(500).json({ message: 'Failed to add provider' });
  }
});

// Update provider
router.put('/:id', async (req, res) => {
  try {
    const provider = await getProviderById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    const { name, description, apiEndpoint, apiKey, walletAddress, price, currency, isActive } = req.body;
    
    if (name) provider.name = name;
    if (description) provider.description = description;
    if (apiEndpoint) provider.apiEndpoint = apiEndpoint;
    if (apiKey) provider.apiKey = apiKey;
    if (walletAddress) provider.walletAddress = walletAddress;
    if (price) provider.price = price;
    if (currency) provider.currency = currency;
    if (isActive !== undefined) provider.isActive = isActive;
    
    await provider.save();
    
    res.json(provider);
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({ message: 'Failed to update provider' });
  }
});

export default router; 