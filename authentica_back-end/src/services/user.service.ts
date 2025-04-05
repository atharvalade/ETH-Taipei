import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { uploadToIPFS, getFromIPFS } from './ipfs.service';

/**
 * Get user by wallet address, create if not exists
 */
export const getOrCreateUser = async (walletAddress: string): Promise<IUser> => {
  try {
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      user = new User({
        walletAddress,
        verificationCount: 0,
        isWorldIdVerified: false
      });
      await user.save();
    }
    
    return user;
  } catch (error) {
    console.error('Error getting/creating user:', error);
    throw new Error('Failed to get or create user');
  }
};

/**
 * Store content to IPFS and add the hash to the user's profile
 */
export const storeContentToIPFS = async (
  walletAddress: string,
  content: string
): Promise<{ hash: string; hashKey: string }> => {
  try {
    // Generate a unique key for this content
    const hashKey = crypto.randomBytes(16).toString('hex');
    
    // Encrypt the content with the hashKey for added security
    // In a real-world app, you'd want more robust encryption
    const contentToStore = JSON.stringify({
      content,
      key: hashKey,
      timestamp: new Date().toISOString()
    });
    
    // Upload to IPFS
    const hash = await uploadToIPFS(contentToStore);
    
    // Get or create user
    const user = await getOrCreateUser(walletAddress);
    
    // Add hash to user's record
    user.ipfsHashes.push({
      hash,
      hashKey,
      timestamp: new Date()
    });
    
    await user.save();
    
    return { hash, hashKey };
  } catch (error) {
    console.error('Error storing content to IPFS:', error);
    throw new Error('Failed to store content to IPFS');
  }
};

/**
 * Retrieve content from IPFS using hash and hashKey
 */
export const getContentFromIPFS = async (
  hash: string, 
  hashKey: string
): Promise<string | null> => {
  try {
    const encryptedContent = await getFromIPFS(hash);
    
    // Parse and validate the content
    const parsedContent = JSON.parse(encryptedContent);
    
    if (parsedContent.key !== hashKey) {
      throw new Error('Invalid hash key');
    }
    
    return parsedContent.content;
  } catch (error) {
    console.error('Error retrieving content from IPFS:', error);
    return null;
  }
};

/**
 * Update user's verification result
 */
export const updateVerificationResult = async (
  walletAddress: string,
  hash: string,
  result: {
    isHumanWritten: boolean;
    confidenceScore: number;
    provider: string;
    chain: string;
  },
  transactionHash?: string
): Promise<IUser> => {
  try {
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Find the IPFS hash entry
    const hashEntry = user.ipfsHashes.find(entry => entry.hash === hash);
    
    if (!hashEntry) {
      throw new Error('IPFS hash not found');
    }
    
    // Update the result
    hashEntry.result = result;
    
    if (transactionHash) {
      hashEntry.transactionHash = transactionHash;
    }
    
    // Increment verification count
    user.verificationCount += 1;
    
    await user.save();
    
    return user;
  } catch (error) {
    console.error('Error updating verification result:', error);
    throw new Error('Failed to update verification result');
  }
};

/**
 * Update user's NFT token ID for a verification
 */
export const updateNftTokenId = async (
  walletAddress: string,
  hash: string,
  nftTokenId: string
): Promise<IUser> => {
  try {
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Find the IPFS hash entry
    const hashEntry = user.ipfsHashes.find(entry => entry.hash === hash);
    
    if (!hashEntry) {
      throw new Error('IPFS hash not found');
    }
    
    // Update the NFT token ID
    hashEntry.nftTokenId = nftTokenId;
    
    await user.save();
    
    return user;
  } catch (error) {
    console.error('Error updating NFT token ID:', error);
    throw new Error('Failed to update NFT token ID');
  }
};

/**
 * Get user transaction history
 */
export const getUserTransactionHistory = async (
  walletAddress: string
): Promise<Array<{
  hash: string;
  hashKey: string;
  timestamp: Date;
  result?: {
    isHumanWritten: boolean;
    confidenceScore: number;
    provider: string;
    chain: string;
  };
  transactionHash?: string;
  nftTokenId?: string;
}>> => {
  try {
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return [];
    }
    
    return user.ipfsHashes.sort((a, b) => {
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  } catch (error) {
    console.error('Error getting user transaction history:', error);
    throw new Error('Failed to get user transaction history');
  }
}; 