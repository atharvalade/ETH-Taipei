import { create } from 'ipfs-http-client';
import { config } from '../config';

// Configure auth for Infura IPFS
const auth = 
  'Basic ' + Buffer.from(config.ipfsApiKey + ':' + config.ipfsApiSecret).toString('base64');

const client = create({
  url: config.ipfsApiUrl,
  headers: {
    authorization: auth
  }
});

/**
 * Upload content to IPFS and return the hash
 */
export const uploadToIPFS = async (content: string): Promise<string> => {
  try {
    // Add the content to IPFS
    const result = await client.add(content);
    return result.path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload content to IPFS');
  }
};

/**
 * Retrieve content from IPFS by hash
 */
export const getFromIPFS = async (ipfsHash: string): Promise<string> => {
  try {
    let content = '';
    
    // Stream the file content from IPFS
    const stream = client.cat(ipfsHash);
    for await (const chunk of stream) {
      content += chunk.toString();
    }
    
    return content;
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw new Error('Failed to retrieve content from IPFS');
  }
}; 