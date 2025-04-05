"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MiniKit, tokenToDecimals, Tokens, PayCommandInput } from "@worldcoin/minikit-js";

// Mock data for providers (should match the data in providers/page.tsx)
const mockProviders = [
  {
    id: "provider1",
    name: "RealText Systems",
    description: "Highest accuracy for technical documentation verification",
    price: 5,
    currency: "WRD",
    accuracyScore: 0.992,
    specialty: "Technical Documentation",
    specialtyIcon: "📄",
    logoColor: "#4F46E5", // indigo
    logoBackground: "bg-indigo-600",
    borderColor: "border-indigo-400",
    logoText: "R",
    walletAddress: "0x0c892815f0B058E69987920A23FBb33c834289cf",
  },
  {
    id: "provider2",
    name: "VerifyAI Labs",
    description: "Cutting edge language pattern recognition with specialized academic focus",
    price: 2.5,
    currency: "USDC",
    accuracyScore: 0.987,
    specialty: "Academic Papers",
    specialtyIcon: "🎓",
    logoColor: "#0EA5E9", // sky blue
    logoBackground: "bg-sky-500",
    borderColor: "border-sky-400",
    logoText: "V",
    walletAddress: "0x0c892815f0B058E69987920A23FBb33c834289cf",
  },
  {
    id: "provider3",
    name: "TrueContent",
    description: "Industry standard for news verification with real-time fact checking",
    price: 3.8,
    currency: "WRD",
    accuracyScore: 0.975,
    specialty: "News Articles",
    specialtyIcon: "📰",
    logoColor: "#000000", // black
    logoBackground: "bg-black",
    borderColor: "border-gray-400",
    logoText: "T",
    walletAddress: "0x0c892815f0B058E69987920A23FBb33c834289cf",
  },
  {
    id: "provider4",
    name: "AuthentiCheck",
    description: "Specialized in creative content with stylistic analysis",
    price: 0.0001,
    currency: "BTC",
    accuracyScore: 0.969,
    specialty: "Creative Writing",
    specialtyIcon: "✍️",
    logoColor: "#9333EA", // purple
    logoBackground: "bg-purple-600",
    borderColor: "border-purple-400",
    logoText: "A",
    walletAddress: "0x0c892815f0B058E69987920A23FBb33c834289cf",
  }
];

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams?.get('providerId');
  
  const [provider, setProvider] = useState<any>(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [chain, setChain] = useState<'WORLD' | 'ROOTSTOCK'>('WORLD');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [paymentToken, setPaymentToken] = useState<'WLD' | 'USDC'>('USDC');
  
  // Load provider details and wallet address
  useEffect(() => {
    // Check if MiniKit is available (running in World App)
    if (MiniKit.isInstalled()) {
      if (MiniKit.walletAddress) {
        setWalletAddress(MiniKit.walletAddress);
      }
    }

    if (providerId) {
      const foundProvider = mockProviders.find(p => p.id === providerId);
      if (foundProvider) {
        setProvider(foundProvider);
      } else {
        setError('Provider not found');
      }
    } else {
      router.push('/providers');
    }
  }, [providerId, router]);
  
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentToken(e.target.value as 'WLD' | 'USDC');
  };
  
  const processPayment = async (userWalletAddress: string, hash: string, hashKey: string) => {
    try {
      // Get the API URL from environment variables, fallback to relative URL for local dev
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      
      // Step 1: Initiate payment and get reference ID
      const initiateResponse = await fetch(`${apiUrl}/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: userWalletAddress,
        }),
      });
      
      if (!initiateResponse.ok) {
        throw new Error('Failed to initiate payment');
      }
      
      const { id: referenceId } = await initiateResponse.json();
      
      // Step 2: Create payment payload for World chain
      const payload: PayCommandInput = {
        reference: referenceId,
        to: '0x3f2c9135872431e0957bc25ac334a7c63c92a10f', // Recipient address
        tokens: [
          paymentToken === 'USDC' ? 
            {
              symbol: Tokens.USDCE,
              token_amount: tokenToDecimals(0.1, Tokens.USDCE).toString(), // 0.1 USDC
            } : 
            {
              symbol: Tokens.WLD,
              token_amount: tokenToDecimals(1, Tokens.WLD).toString(), // 1 WLD
            }
        ],
        description: `Authentica verification by ${provider?.name}`,
      };
      
      if (!MiniKit.isInstalled()) {
        console.log('MiniKit not installed, simulating payment for development');
        return { success: true, referenceId, mock: true };
      }
      
      // Step 3: Execute the payment command
      const { finalPayload } = await MiniKit.commandsAsync.pay(payload);
      
      if (finalPayload.status !== 'success') {
        throw new Error('Payment failed or was cancelled');
      }
      
      // Step 4: Confirm payment with our backend
      const confirmResponse = await fetch(`${apiUrl}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: referenceId,
          transaction_id: finalPayload.transaction_id,
        }),
      });
      
      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm payment');
      }
      
      const confirmData = await confirmResponse.json();
      
      if (!confirmData.success) {
        throw new Error(confirmData.error || 'Payment verification failed');
      }
      
      return { success: true, referenceId };
    } catch (error: any) {
      console.error('Payment processing error:', error);
      throw new Error(error.message || 'Payment processing failed');
    }
  };
  
  // Update the verification request to include payment token information
  const verifyContent = async (hash: string, hashKey: string, userWalletAddress: string) => {
    // Get the API URL from environment variables, fallback to relative URL for local dev
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    
    const verifyResponse = await fetch(`${apiUrl}/authentica`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'verify',
        providerId: providerId,
        hash: hash,
        hashKey: hashKey,
        walletAddress: userWalletAddress,
        chain: chain,
        paymentToken: chain === 'WORLD' ? paymentToken : undefined
      }),
    });
    
    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error || 'Verification failed');
    }
    
    return await verifyResponse.json();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter content to verify');
      return;
    }
    
    if (!provider) {
      setError('Provider not found');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Use default wallet address if not available from MiniKit
      const userWalletAddress = walletAddress || '0xDefaultWalletAddress';
      
      // Get the API URL from environment variables, fallback to relative URL for local dev
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      
      // Step 1: Store the content in IPFS through our backend
      const storeResponse = await fetch(`${apiUrl}/submit-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          walletAddress: userWalletAddress,
        }),
      });
      
      if (!storeResponse.ok) {
        const errorData = await storeResponse.json();
        throw new Error(errorData.error || 'Failed to store content');
      }
      
      const storeData = await storeResponse.json();
      
      if (!storeData.success) {
        throw new Error(storeData.error || 'Failed to store content');
      }
      
      // Save hash and hashKey for verification
      const hash = storeData.hash;
      const hashKey = storeData.hashKey;
      
      // Step 2: Process payment if on World chain
      if (chain === 'WORLD') {
        try {
          await processPayment(userWalletAddress, hash, hashKey);
        } catch (paymentError: any) {
          throw new Error(`Payment failed: ${paymentError.message}`);
        }
      }
      
      // Step 3: Verify the content
      const verifyData = await verifyContent(hash, hashKey, userWalletAddress);
      
      if (!verifyData.success) {
        throw new Error('Verification failed');
      }
      
      // Generate a verification ID for tracking
      const mockVerificationId = `verify-${Math.random().toString(36).substring(2, 10)}`;
      
      // Navigate to results page with hash details
      router.push(`/result?id=${mockVerificationId}&hash=${hash}&hashKey=${hashKey}`);
    } catch (error: any) {
      console.error('Error during verification:', error);
      setError(error.message || 'Verification process failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChain(e.target.value as 'WORLD' | 'ROOTSTOCK');
  };
  
  if (!provider) {
    return (
      <div className="relative z-10 container-mobile flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          {error ? (
            <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
          ) : (
            <div className="text-medium-contrast">Loading provider information...</div>
          )}
          <button 
            onClick={() => router.push('/providers')}
            className="btn-primary mt-4"
          >
            Back to Providers
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative z-10 container-mobile">
      {/* Header with provider info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-6"
      >
        <button 
          onClick={() => router.back()}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div>
          <h1 className="text-xl font-bold text-high-contrast">{provider.name}</h1>
          <div className="flex items-center">
            <span className="text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
              {(provider.accuracyScore * 100).toFixed(1)}% Accuracy
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Provider card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-md mb-6 relative"
        style={{ 
          borderTopWidth: '4px',
          borderTopColor: provider.logoColor,
        }}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-full ${provider.logoBackground} flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md`}>
              {provider.logoText}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-high-contrast font-medium">{provider.specialtyIcon}</span>
                <span className="text-medium-contrast">{provider.specialty}</span>
              </div>
              <div className="text-right font-semibold text-high-contrast text-lg mt-1">
                {provider.price} {provider.currency}
                <div className="text-xs text-low-contrast">per check</div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-medium-contrast">{provider.description}</p>
        </div>
      </motion.div>
      
      {/* Verification form */}
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-medium-contrast mb-1">
            Content to verify:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-500 bg-white dark:bg-gray-800 p-3 text-high-contrast placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            placeholder="Paste the text you want to verify..."
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Paste the content you want to verify for AI generation. The entire text will be analyzed by the provider&apos;s algorithms.</p>
        </div>
        
        <div>
          <label htmlFor="chain" className="block text-sm font-medium text-medium-contrast mb-1">
            Blockchain:
          </label>
          <select
            id="chain"
            value={chain}
            onChange={handleChainChange}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-500 bg-white dark:bg-gray-800 p-3 text-high-contrast text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          >
            <option value="WORLD">World Chain (WRD)</option>
            <option value="ROOTSTOCK">Rootstock (BTC)</option>
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select which blockchain you want to use for payment and verification.</p>
        </div>
        
        {chain === 'WORLD' && (
          <div>
            <label className="block text-sm font-medium text-medium-contrast mb-1">
              Payment Token:
            </label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentToken"
                  value="USDC"
                  checked={paymentToken === 'USDC'}
                  onChange={handleTokenChange}
                  className="mr-2"
                />
                <span className="text-sm">0.1 USDC</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentToken"
                  value="WLD"
                  checked={paymentToken === 'WLD'}
                  onChange={handleTokenChange}
                  className="mr-2"
                />
                <span className="text-sm">1 WLD</span>
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select which token you want to use for payment on World chain.
            </p>
          </div>
        )}
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Verify Content</>
            )}
          </button>
          
          <p className="mt-4 text-center text-xs text-medium-contrast">
            {chain === 'WORLD' 
              ? `You will be prompted to pay ${paymentToken === 'USDC' ? '0.1 USDC' : '1 WLD'} on World chain` 
              : `You will be prompted to approve a payment of ${provider.price} ${provider.currency}`}
          </p>
        </div>
      </motion.form>
    </div>
  );
} 