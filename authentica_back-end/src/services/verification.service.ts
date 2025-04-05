import { uploadToIPFS } from './ipfs.service';
import { verifyContent, getProviderById } from './provider.service';
import { submitVerificationResult } from './blockchain.service';
import Verification, { IVerification } from '../models/Verification';
import Provider from '../models/Provider';
import mongoose from 'mongoose';

/**
 * Process a new verification request
 */
export const processVerification = async (
  userId: string,
  providerId: string,
  content: string,
  chain: 'WORLD' | 'ROOTSTOCK'
): Promise<IVerification> => {
  try {
    // Check if provider exists
    const provider = await getProviderById(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    // Upload content to IPFS
    const contentIpfsHash = await uploadToIPFS(content);
    
    // Create verification record
    const verification = new Verification({
      userId,
      providerId: new mongoose.Types.ObjectId(providerId),
      contentIpfsHash,
      chain,
      status: 'PENDING'
    });
    
    await verification.save();
    
    // Process this verification (in real-world, this would be an async process)
    void executeVerification((verification._id as mongoose.Types.ObjectId).toString());
    
    return verification;
  } catch (error) {
    console.error('Error processing verification:', error);
    throw new Error('Failed to process verification request');
  }
};

/**
 * Execute the verification process
 */
const executeVerification = async (verificationId: string): Promise<void> => {
  try {
    // Get verification request
    const verification = await Verification.findById(verificationId);
    if (!verification) {
      throw new Error('Verification not found');
    }
    
    // Get verification result from provider
    const result = await verifyContent(
      verification.providerId.toString(), 
      verification.contentIpfsHash
    );
    
    // Update verification with result
    verification.isHumanWritten = result.isHumanWritten;
    verification.confidenceScore = result.confidenceScore;
    verification.status = 'COMPLETED';
    verification.completedAt = new Date();
    
    await verification.save();
    
    // Submit result to blockchain (creates event and mints NFT if applicable)
    if (verification.transactionHash) {
      await submitVerificationResult(
        verification.transactionHash,
        result.isHumanWritten,
        result.confidenceScore,
        verification.chain as 'WORLD' | 'ROOTSTOCK'
      );
    }
  } catch (error) {
    console.error('Error executing verification:', error);
    
    // Update verification status to failed
    await Verification.findByIdAndUpdate(verificationId, {
      status: 'FAILED'
    });
  }
};

/**
 * Get all verifications for a user
 */
export const getUserVerifications = async (userId: string): Promise<IVerification[]> => {
  return await Verification.find({ userId }).populate('providerId').sort({ createdAt: -1 });
};

/**
 * Get verification by ID
 */
export const getVerificationById = async (verificationId: string): Promise<IVerification | null> => {
  return await Verification.findById(verificationId).populate('providerId');
};

/**
 * Get providers with stats
 */
export const getProvidersWithStats = async () => {
  const providers = await Provider.find({ isActive: true });
  
  const providerStats = await Promise.all(
    providers.map(async (provider) => {
      const verificationCount = await Verification.countDocuments({
        providerId: provider._id,
        status: 'COMPLETED'
      });
      
      const accurateVerifications = await Verification.countDocuments({
        providerId: provider._id,
        status: 'COMPLETED',
        isHumanWritten: true,
        confidenceScore: { $gte: 0.90 }
      });
      
      return {
        ...provider.toObject(),
        verificationCount,
        accuracy: verificationCount > 0 ? accurateVerifications / verificationCount : 0
      };
    })
  );
  
  return providerStats;
}; 