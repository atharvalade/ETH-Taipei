import axios from 'axios';
import Provider, { IProvider } from '../models/Provider';
import { getFromIPFS } from './ipfs.service';

interface VerificationResult {
  isHumanWritten: boolean;
  confidenceScore: number;
}

/**
 * Get all active providers
 */
export const getActiveProviders = async (): Promise<IProvider[]> => {
  return await Provider.find({ isActive: true });
};

/**
 * Get a provider by ID
 */
export const getProviderById = async (id: string): Promise<IProvider | null> => {
  return await Provider.findById(id);
};

/**
 * Check content using a provider's API
 */
export const verifyContent = async (providerId: string, ipfsHash: string): Promise<VerificationResult> => {
  try {
    // Get provider info from database
    const provider = await getProviderById(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    // Get content from IPFS
    const content = await getFromIPFS(ipfsHash);
    
    // Call provider's API with content
    const response = await axios.post(
      provider.apiEndpoint,
      { content },
      {
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Mock response structure - this should be adapted to match actual provider API responses
    return {
      isHumanWritten: response.data.isHumanWritten || false,
      confidenceScore: response.data.confidenceScore || 0
    };
  } catch (error) {
    console.error('Error verifying content:', error);
    throw new Error('Failed to verify content with provider');
  }
};

/**
 * Add a new provider
 */
export const addProvider = async (providerData: Partial<IProvider>): Promise<IProvider> => {
  const provider = new Provider(providerData);
  return await provider.save();
};

/**
 * Update provider accuracy score based on test dataset
 */
export const evaluateProviderAccuracy = async (providerId: string): Promise<number> => {
  // In a real implementation, this would use a test dataset to evaluate the provider
  // For the hackathon MVP, we'll simulate with a random score between 70-100
  const accuracyScore = 70 + Math.random() * 30;
  
  await Provider.findByIdAndUpdate(providerId, { accuracyScore });
  
  return accuracyScore;
}; 