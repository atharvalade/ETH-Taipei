"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MiniKit } from "@worldcoin/minikit-js";

// Mock verification results (in a real app, this would come from an API)
const mockResults = {
  "verify-1abc123": {
    isHumanWritten: true,
    confidenceScore: 0.97,
    provider: {
      id: "provider1",
      name: "RealText Systems",
      logoText: "R",
      logoBackground: "bg-indigo-600",
    },
    chain: "WORLD",
    status: "COMPLETED",
    ipfsHash: "Qm...abc123",
    transactionHash: "0x1234...abcd",
  },
  "verify-2def456": {
    isHumanWritten: false,
    confidenceScore: 0.89,
    provider: {
      id: "provider2",
      name: "VerifyAI Labs",
      logoText: "V",
      logoBackground: "bg-sky-500",
    },
    chain: "WORLD",
    status: "COMPLETED",
    ipfsHash: "Qm...def456",
    transactionHash: "0x5678...efgh",
  }
};

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mintingNft, setMintingNft] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [nftTokenId, setNftTokenId] = useState<string | null>(null);
  
  // Load verification result
  useEffect(() => {
    if (!id) {
      router.push('/providers');
      return;
    }
    
    // Simulate API call to get verification result
    setTimeout(() => {
      setLoading(false);
      
      // Check if we have a mock result for this ID
      if (id in mockResults) {
        setResult(mockResults[id as keyof typeof mockResults]);
      } else {
        // Generate a random result for demo purposes
        const isHuman = Math.random() > 0.3; // 70% chance of being human-written
        const confidence = isHuman 
          ? 0.95 + (Math.random() * 0.05) // 95-100% for human content
          : 0.75 + (Math.random() * 0.15); // 75-90% for AI content
          
        const randomResult = {
          isHumanWritten: isHuman,
          confidenceScore: confidence,
          provider: {
            id: "provider1",
            name: "RealText Systems",
            logoText: "R",
            logoBackground: "bg-indigo-600",
          },
          chain: "WORLD",
          status: "COMPLETED",
          ipfsHash: `Qm...${Math.random().toString(36).substring(2, 8)}`,
          transactionHash: `0x${Math.random().toString(36).substring(2, 10)}`,
        };
        
        setResult(randomResult);
      }
    }, 1500);
  }, [id, router]);
  
  const handleMintNft = async () => {
    if (!result || !result.isHumanWritten || result.confidenceScore < 0.95) {
      return;
    }
    
    setMintingNft(true);
    setError('');
    
    try {
      // Check if MiniKit is available (running in World App)
      if (MiniKit.isInstalled()) {
        // In a real app, this would call your backend to mint the NFT on the blockchain
        
        // Simulate minting process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a mock token ID
        const tokenId = `AUTH-${Math.floor(Math.random() * 1000000)}`;
        setNftTokenId(tokenId);
        setNftMinted(true);
      } else {
        // For testing outside World App
        console.log('Not in World App, simulating NFT minting...');
        
        // Simulate minting process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const tokenId = `AUTH-${Math.floor(Math.random() * 1000000)}`;
        setNftTokenId(tokenId);
        setNftMinted(true);
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
          className="card mb-6 shadow-lg bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/20"
        >
          <div className="text-center">
            <div className="mb-3">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.07989 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.07989 21 8.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8.5 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M15.5 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M7.5 21H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M7 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M7 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-high-contrast">Mint Authenticity Certificate</h3>
            </div>
            
            <p className="text-sm text-medium-contrast mb-4">
              Your content has been verified as human-written with high confidence.
              Mint an NFT certificate to prove authenticity.
            </p>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            
            <motion.button
              onClick={handleMintNft}
              disabled={mintingNft}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`btn-primary w-full ${mintingNft ? 'opacity-70' : ''}`}
            >
              {mintingNft ? 'Minting...' : 'Mint NFT Certificate'}
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* Success message after minting */}
      {nftMinted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30 mb-6 shadow-lg"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-3 text-green-600 dark:text-green-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 className="text-lg font-semibold ml-2">NFT Successfully Minted!</h3>
            </div>
            
            <p className="text-sm text-green-700 dark:text-green-300 mb-1">
              Your authenticity certificate has been minted on {result.chain}.
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              Token ID: {nftTokenId}
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4"
      >
        <button
          onClick={() => router.push('/providers')}
          className="btn-secondary flex-1"
        >
          New Verification
        </button>
        
        <button
          onClick={() => {
            // Share result (would implement deeper sharing functionality in a real app)
            alert('Sharing functionality would be implemented here');
          }}
          className="btn-primary flex-1"
        >
          Share Result
        </button>
      </motion.div>
    </div>
  );
} 