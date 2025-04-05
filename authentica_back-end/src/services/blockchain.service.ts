import { ethers } from 'ethers';
import { config } from '../config';

// Import contract ABI - in a real project, this would be imported from a compiled contract
// We'll use a placeholder for now
const contractABI: any[] = []; // This would be the compiled contract ABI

interface BlockchainConfig {
  rpcUrl: string;
  contractAddress: string;
  privateKey: string;
}

// Setup for World Chain
const worldChainConfig: BlockchainConfig = {
  rpcUrl: config.worldChainRpc,
  contractAddress: process.env.WORLD_CONTRACT_ADDRESS || '',
  privateKey: process.env.WORLD_PRIVATE_KEY || ''
};

// Setup for Rootstock
const rootstockConfig: BlockchainConfig = {
  rpcUrl: config.rootstockRpc,
  contractAddress: process.env.ROOTSTOCK_CONTRACT_ADDRESS || '',
  privateKey: process.env.ROOTSTOCK_PRIVATE_KEY || ''
};

/**
 * Get provider and contract instance for the specified chain
 */
const getContractInstance = (chain: 'WORLD' | 'ROOTSTOCK') => {
  const config = chain === 'WORLD' ? worldChainConfig : rootstockConfig;
  
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);
  const contract = new ethers.Contract(config.contractAddress, contractABI, wallet);
  
  return { provider, wallet, contract };
};

/**
 * Register a provider on the blockchain
 */
export const registerProvider = async (
  providerId: string, 
  walletAddress: string, 
  price: number,
  tokenPrice: number,
  chain: 'WORLD' | 'ROOTSTOCK'
) => {
  try {
    const { contract } = getContractInstance(chain);
    
    const tx = await contract.registerProvider(
      providerId, 
      walletAddress, 
      ethers.utils.parseEther(price.toString()),
      ethers.utils.parseEther(tokenPrice.toString())
    );
    
    return await tx.wait();
  } catch (error) {
    console.error(`Error registering provider on ${chain}:`, error);
    throw new Error(`Failed to register provider on ${chain}`);
  }
};

/**
 * Submit verification result to the blockchain
 */
export const submitVerificationResult = async (
  requestId: string,
  isHumanWritten: boolean,
  confidenceScore: number,
  chain: 'WORLD' | 'ROOTSTOCK'
) => {
  try {
    const { contract } = getContractInstance(chain);
    
    // Convert confidence score to contract format (95% = 9500)
    const scoreForContract = Math.floor(confidenceScore * 100);
    
    const tx = await contract.submitVerificationResult(
      requestId,
      isHumanWritten,
      scoreForContract
    );
    
    return await tx.wait();
  } catch (error) {
    console.error(`Error submitting verification result on ${chain}:`, error);
    throw new Error(`Failed to submit verification result on ${chain}`);
  }
};

/**
 * Get verification details from the blockchain
 */
export const getVerificationDetails = async (
  requestId: string,
  chain: 'WORLD' | 'ROOTSTOCK'
) => {
  try {
    const { contract } = getContractInstance(chain);
    
    const verificationData = await contract.verificationRequests(requestId);
    
    return {
      ipfsContentHash: verificationData.ipfsContentHash,
      user: verificationData.user,
      isVerified: verificationData.isVerified,
      isHumanWritten: verificationData.isHumanWritten,
      confidenceScore: Number(verificationData.confidenceScore) / 100, // Convert from contract format
      isCompleted: verificationData.isCompleted
    };
  } catch (error) {
    console.error(`Error getting verification details from ${chain}:`, error);
    throw new Error(`Failed to get verification details from ${chain}`);
  }
}; 