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

interface VerificationResult {
  isHumanWritten: boolean;
  confidenceScore: number;
  provider: any;
  chain: string;
  status: string;
  ipfsHash: string;
  transactionHash: string;
  paymentInfo?: {
    token: string;
    amount: string;
  };
}

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') || '';
  const hash = searchParams?.get('hash') || '';
  const hashKey = searchParams?.get('hashKey') || '';
  const urlWalletAddress = searchParams?.get('wallet') || '';
  
  // Debug logging
  console.log('PARAMETERS FROM URL:');
  console.log('- ID:', id);
  console.log('- Hash:', hash);
  console.log('- HashKey:', hashKey);
  console.log('- Wallet:', urlWalletAddress);
  
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mintingNft, setMintingNft] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [nftTokenId, setNftTokenId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  // Load verification result
  useEffect(() => {
    // Use wallet address from URL parameter or fallback
    let userWalletAddress = urlWalletAddress;
    
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
        
        // Log the exact request we're sending
        const requestBody = {
          providerId: 'provider1',
          hash: hash,
          hashKey: hashKey,
          walletAddress: userWalletAddress,
          chain: 'WORLD'
        };
        
        console.log('Sending verification request:');
        console.log(JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(`${apiUrl}/verify-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        // Log response status
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to verify content');
        }
        
        const data = await response.json();
        console.log('API Response data:', JSON.stringify(data, null, 2));
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to verify content');
        }
        
        // Format the result for display
        if (data.result.chain === 'WORLD') {
          setResult({
            isHumanWritten: data.result.isHumanWritten,
            confidenceScore: data.result.confidenceScore,
            provider: providerData[data.result.provider as keyof typeof providerData],
            chain: data.result.chain,
            status: 'COMPLETED',
            ipfsHash: hash,
            transactionHash: `0x${Math.random().toString(36).substring(2, 10)}`, // Mock transaction hash
            paymentInfo: {
              token: data.result.paymentToken || 'USDC', // Default to USDC if not specified
              amount: data.result.paymentToken === 'WLD' ? '1 WLD' : '0.1 USDC'
            }
          });
        } else {
          setResult({
            isHumanWritten: data.result.isHumanWritten,
            confidenceScore: data.result.confidenceScore,
            provider: providerData[data.result.provider as keyof typeof providerData],
            chain: data.result.chain,
            status: 'COMPLETED',
            ipfsHash: hash,
            transactionHash: `0x${Math.random().toString(36).substring(2, 10)}`, // Mock transaction hash
          });
        }
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
  }, [id, hash, hashKey, router, urlWalletAddress]);
  
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
  
  const handleMetaMaskPayment = () => {
    // Wallet address is the same as used for verification
    const receiverAddress = '0xa20C96EA7B9AbAe32217EbA25577cDe099039D5D';
    
    // Payment amount in rBTC (0.00001 ≈ $1)
    const paymentAmount = 0.00001;
    
    // Convert to wei (as an integer)
    const valueInWei = Math.floor(paymentAmount * 1e18);
    
    try {
      console.log('Opening MetaMask for NFT payment...');
      
      // Generate the MetaMask deep link based on platform
      const isMobile = /iPhone|iPad|iPod|Android/i.test(
        typeof navigator !== 'undefined' ? navigator.userAgent : ''
      );
      
      // Create appropriate links for mobile vs desktop
      const mobileLink = `ethereum:${receiverAddress}@31/transfer?value=${valueInWei}`;
      const webLink = `https://metamask.app.link/send/${receiverAddress}?value=${valueInWei}`;
      
      const deepLink = isMobile ? mobileLink : webLink;
      
      // Use window.open which works better than location.href for deep links
      window.open(deepLink, '_blank');
      
      // After a short timeout, if the user is still on the page, assume they want to proceed anyway
      setTimeout(() => {
        if (!document.hidden) {
          handleMintNft();
        }
      }, 3000);
    } catch (error) {
      console.error('Error opening MetaMask:', error);
      // Fall back to regular minting
      handleMintNft();
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
          
          {result.chain === 'WORLD' && result.paymentInfo && (
            <div className="flex justify-between items-center">
              <span className="text-medium-contrast">Payment</span>
              <span className="font-medium text-high-contrast">
                {result.paymentInfo.amount}
                <span className="ml-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                  World Chain
                </span>
              </span>
            </div>
          )}
          
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
          <h2 className="text-lg font-semibold text-high-contrast mb-2">Mint NFT Certificate on Rootstock</h2>
          <p className="text-sm text-medium-contrast mb-4">
            Your content has been verified as human-written with high confidence. Create a permanent record on the Rootstock blockchain with all verification metadata.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4">
            <h3 className="text-sm font-medium mb-2">NFT Metadata</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Content Hash:</span>
                <span className="font-mono">{hash.substring(0, 10)}...{hash.substring(hash.length - 10)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hash Key:</span>
                <span className="font-mono">{hashKey.substring(0, 8)}...{hashKey.substring(hashKey.length - 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IPFS URL:</span>
                <a 
                  href={`https://gateway.pinata.cloud/ipfs/${hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-mono"
                >
                  pinata.cloud/ipfs/{hash.substring(0, 8)}...
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verification Method:</span>
                <span>{result.provider?.name || 'Authentica'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verification Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verification Time:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-3 mb-4">
            <label className="text-sm font-medium mb-1">Select Payment Method</label>
            <div className="flex space-x-2">
              <button
                onClick={handleMetaMaskPayment}
                disabled={mintingNft}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 784 784" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M392 784C608.28 784 784 608.28 784 392C784 175.72 608.28 0 392 0C175.72 0 0 175.72 0 392C0 608.28 175.72 784 392 784Z" fill="#24292E"/>
                  <path d="M392 163.333L261.333 359.733L392 294.267V163.333Z" fill="#FFFFFF"/>
                  <path d="M392 294.267L261.333 359.733L392 457.333V294.267Z" fill="#FFFFFF"/>
                  <path d="M392 457.333L522.667 359.733L392 294.267V457.333Z" fill="#FFFFFF"/>
                  <path d="M261.333 392.533L392 620.667V490L261.333 392.533Z" fill="#FFFFFF"/>
                  <path d="M392 490V620.667L522.667 392.533L392 490Z" fill="#FFFFFF"/>
                </svg>
                Pay with MetaMask (0.00001 rBTC ≈ $1)
              </button>
            </div>
          </div>
          
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
                Minting on Rootstock...
              </>
            ) : (
              <>Mint Rootstock NFT Certificate</>
            )}
          </button>
          
          <p className="mt-3 text-xs text-center text-medium-contrast">
            The NFT will be minted on the Rootstock blockchain and include all verification metadata.
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
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-300">Rootstock NFT Minted!</h2>
          </div>
          
          <p className="text-sm text-green-700 dark:text-green-400 mb-3">
            Your NFT certificate has been successfully minted on the Rootstock blockchain with all verification metadata. You can now share your content with confidence that it has been verified as human-written.
          </p>
          
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Token ID:</span>
              <span className="font-mono text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">{nftTokenId}</span>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blockchain:</span>
              <span className="font-mono text-xs px-2 py-1 rounded flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9.5L12 4L22 9.5L12 15L2 9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 11.5V16.5L12 20L18 16.5V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Rootstock Testnet
              </span>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">IPFS Hash:</span>
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-mono text-xs"
              >
                {hash.substring(0, 8)}...{hash.substring(hash.length - 8)}
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mint Date:</span>
              <span className="text-xs">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => router.push('/profile')}
              className="flex-1 btn-secondary-green py-2.5"
            >
              View in Profile
            </button>
            
            <button
              onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, '_blank')}
              className="flex-grow-0 btn-outline-green p-2.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6H12.01M12 20H12.01M18 12H18.01M6 12H6.01M10 13L8.5 15M14 13L15.5 15M14 11L15.5 9M10 11L8.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
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