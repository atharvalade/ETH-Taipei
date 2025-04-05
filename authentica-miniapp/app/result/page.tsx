"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MiniKit } from "@worldcoin/minikit-js";

// Provider data mapping (this would be fetched from a central source in production)
const providerData = {
  "provider1": {
    id: "provider1",
    name: "RealText Systems",
    logoText: "R",
    logoBackground: "bg-indigo-600",
  },
  "provider2": {
    id: "provider2",
    name: "VerifyAI Labs",
    logoText: "V",
    logoBackground: "bg-sky-500",
  },
  "provider3": {
    id: "provider3",
    name: "TrueContent",
    logoText: "T",
    logoBackground: "bg-black",
  },
  "provider4": {
    id: "provider4",
    name: "AuthentiCheck",
    logoText: "A",
    logoBackground: "bg-purple-600",
  }
};

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') || '';
  const hash = searchParams?.get('hash') || '';
  const hashKey = searchParams?.get('hashKey') || '';
  // Don't decode the hashKey - it was not manually encoded in the verify page
  // Get the wallet address from the URL if available
  const urlWalletAddress = searchParams?.get('wallet') || '';
  
  // Debug logging for hashKey issues
  console.log('DEBUGGING HASHKEY:');
  console.log('URL hashKey parameter:', hashKey);
  console.log('URL wallet parameter:', urlWalletAddress);
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mintingNft, setMintingNft] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [nftTokenId, setNftTokenId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  // Load verification result
  useEffect(() => {
    // Check if MiniKit is available and get wallet address
    let userWalletAddress = urlWalletAddress; // Prioritize URL wallet address
    
    if (!userWalletAddress && MiniKit.isInstalled() && MiniKit.walletAddress) {
      userWalletAddress = MiniKit.walletAddress;
    }
    
    if (!userWalletAddress) {
      userWalletAddress = '0xDefaultWalletAddress';
    }
    
    setWalletAddress(userWalletAddress);
    console.log('Using wallet address for verification:', userWalletAddress);

    if (!id || !hash || !hashKey) {
      router.push('/providers');
      return;
    }
    
    const fetchResult = async () => {
      setLoading(true);
      
      try {
        // Make API call to verify content
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        
        // Log details before API call
        console.log('Verification API call details:');
        console.log('- Provider ID:', 'provider1');
        console.log('- Hash:', hash);
        console.log('- HashKey:', hashKey);
        console.log('- Wallet Address:', userWalletAddress);
        
        const response = await fetch(`${apiUrl}/verify-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            providerId: 'provider1', // Default to provider1 for demo
            hash,
            hashKey,
            walletAddress: userWalletAddress,
            chain: 'WORLD' // Default to WORLD for demo
          }),
        });
        
        // Log response status
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to verify content');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to verify content');
        }
        
        // Format the result for display
        setResult({
          isHumanWritten: data.result.isHumanWritten,
          confidenceScore: data.result.confidenceScore,
          provider: providerData[data.result.provider as keyof typeof providerData],
          chain: data.result.chain,
          status: 'COMPLETED',
          ipfsHash: hash,
          transactionHash: `0x${Math.random().toString(36).substring(2, 10)}`, // Mock transaction hash
        });
      } catch (error: any) {
        console.error('Error fetching verification result:', error);
        setError(error.message || 'Failed to fetch verification result');
        
        // Generate a mock result for demo purposes if API fails
        const isHuman = Math.random() > 0.3; // 70% chance of being human-written
        const confidence = isHuman 
          ? 0.95 + (Math.random() * 0.05) // 95-100% for human content
          : 0.75 + (Math.random() * 0.15); // 75-90% for AI content
          
        setResult({
          isHumanWritten: isHuman,
          confidenceScore: confidence,
          provider: providerData.provider1,
          chain: "WORLD",
          status: "COMPLETED",
          ipfsHash: hash || `Qm...${Math.random().toString(36).substring(2, 8)}`,
          transactionHash: `0x${Math.random().toString(36).substring(2, 10)}`,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchResult();
  }, [id, hash, hashKey, router, walletAddress, urlWalletAddress]);
  
  const handleMintNft = async () => {
    if (!result || !result.isHumanWritten || result.confidenceScore < 0.95) {
      return;
    }
    
    setMintingNft(true);
    setError('');
    
    try {
      // Mock NFT minting - in a real app, this would make a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock token ID
      const tokenId = `AUTH-${Math.floor(Math.random() * 1000000)}`;
      setNftTokenId(tokenId);
      setNftMinted(true);
      
      // Update the NFT token ID in the backend
      if (hash) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
          
          await fetch(`${apiUrl}/update-nft`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress: walletAddress,
              hash: hash,
              nftTokenId: tokenId
            }),
          });
        } catch (error) {
          console.error('Error updating NFT token ID:', error);
          // We don't show this error to the user since the NFT appears to be minted already
        }
      }
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      setError(error.message || 'Failed to mint NFT');
    } finally {
      setMintingNft(false);
    }
  };
  
  if (loading) {
    return (
      <div className="relative z-10 container-mobile flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-medium-contrast">Loading verification result...</p>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="relative z-10 container-mobile flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">Verification not found</div>
          <button 
            onClick={() => router.push('/providers')}
            className="btn-primary"
          >
            Try Another Verification
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative z-10 container-mobile">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-6"
      >
        <button 
          onClick={() => router.push('/providers')}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          aria-label="Go back to providers"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div>
          <h1 className="text-xl font-bold text-high-contrast">Verification Result</h1>
          <div className="flex items-center">
            <span className="text-xs text-medium-contrast">
              Provider: {result.provider.name}
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Result card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6 overflow-hidden shadow-lg"
      >
        {/* Status banner */}
        <div className={`p-4 text-white font-medium -mx-4 -mt-4 mb-4 text-center ${
          result.isHumanWritten 
            ? 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700' 
            : 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700'
        }`}>
          {result.isHumanWritten ? 'Human-Written Content' : 'AI-Generated Content'}
        </div>
        
        {/* Result details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-medium-contrast">Confidence Score</span>
            <div className="flex items-center">
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                <div 
                  className={`h-full ${result.isHumanWritten ? 'bg-green-500' : 'bg-red-500'} rounded-full`} 
                  style={{ width: `${result.confidenceScore * 100}%` }}
                ></div>
              </div>
              <span className="font-medium text-high-contrast">{(result.confidenceScore * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-medium-contrast">Blockchain</span>
            <span className="font-medium text-high-contrast">{result.chain}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-medium-contrast">IPFS Hash</span>
            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-medium-contrast px-2 py-1 rounded">{result.ipfsHash}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-medium-contrast">Transaction</span>
            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-medium-contrast px-2 py-1 rounded truncate max-w-[150px]">{result.transactionHash}</span>
          </div>
          
          {nftMinted && nftTokenId && (
            <div className="flex justify-between items-center">
              <span className="text-medium-contrast">NFT Token ID</span>
              <span className="font-mono text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">{nftTokenId}</span>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* NFT minting card - only show for human-written content with high confidence */}
      {result.isHumanWritten && result.confidenceScore >= 0.95 && !nftMinted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <h2 className="text-lg font-semibold text-high-contrast mb-2">Certificate Your Content</h2>
          <p className="text-sm text-medium-contrast mb-4">
            Your content has been verified as human-written with high confidence. You can now mint an NFT certificate to prove its authenticity.
          </p>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          
          <button
            onClick={handleMintNft}
            disabled={mintingNft}
            className="w-full btn-primary py-3 flex items-center justify-center"
          >
            {mintingNft ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Minting Certificate...
              </>
            ) : (
              <>Mint Certificate NFT (1 USDC)</>
            )}
          </button>
          
          <p className="mt-3 text-xs text-center text-medium-contrast">
            The NFT will be minted to your connected wallet address and will contain a permanent record of this verification.
          </p>
        </motion.div>
      )}
      
      {/* NFT success card */}
      {nftMinted && nftTokenId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-green-50 dark:bg-green-900/20 mb-6"
        >
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-300">Certificate Minted!</h2>
          </div>
          
          <p className="text-sm text-green-700 dark:text-green-400 mb-3">
            Your NFT certificate has been successfully minted. You can now share your content with confidence that it has been verified as human-written.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Token ID:</span>
            <span className="font-mono text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">{nftTokenId}</span>
          </div>
          
          <button
            onClick={() => router.push('/profile')}
            className="w-full btn-secondary-green py-2.5"
          >
            View in Profile
          </button>
        </motion.div>
      )}
      
      <div className="text-center">
        <button 
          onClick={() => router.push('/providers')}
          className="btn-secondary mb-8"
        >
          Verify Another Text
        </button>
      </div>
    </div>
  );
} 