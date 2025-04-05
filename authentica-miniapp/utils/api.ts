// API Response Interfaces
export interface ContentSubmissionResponse {
  success: boolean;
  hash?: string;
  hashKey?: string;
  error?: string;
}

export interface VerificationResponse {
  success: boolean;
  result?: {
    isHumanWritten: boolean;
    confidenceScore: number;
    provider: string;
    chain: string;
    hash: string;
    hashKey: string;
  };
  error?: string;
}

// Get the API URL based on environment
const getApiUrl = () => {
  // In production, use the Vercel deployment URL
  if (process.env.NEXT_PUBLIC_VERCEL_API_URL) {
    return process.env.NEXT_PUBLIC_VERCEL_API_URL;
  }
  
  // Fallback to the deployed API URL
  return process.env.BACKEND_API_URL || 'https://ipfs-api1-ethtaipei.vercel.app/api/authentica';
};

export async function submitContent(content: string, walletAddress: string): Promise<ContentSubmissionResponse> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, walletAddress }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting content:', error);
    throw error;
  }
}

export async function verifyContent(
  providerId: string,
  hash: string,
  hashKey: string,
  walletAddress: string,
  chain: 'WORLD' | 'ROOTSTOCK'
): Promise<VerificationResponse> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'verify',
        providerId, 
        hash, 
        hashKey, 
        walletAddress, 
        chain 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying content:', error);
    throw error;
  }
}

export async function updateNFTTokenId(
  walletAddress: string,
  hash: string,
  nftTokenId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'update-nft',
        walletAddress, 
        hash, 
        nftTokenId 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating NFT token ID:', error);
    throw error;
  }
}

export async function getUserData(
  walletAddress: string
): Promise<{ success: boolean; walletAddress: string; verificationCount: number; transactions: any[]; error?: string }> {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}?action=user&walletAddress=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
} 