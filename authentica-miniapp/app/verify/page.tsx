"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MiniKit } from "@worldcoin/minikit-js";
import PaymentSelector from "@/components/Payment/PaymentSelector";

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
  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [storedContentHash, setStoredContentHash] = useState<string>('');
  const [storedHashKey, setStoredHashKey] = useState<string>('');
  
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
  
  const handlePaymentSuccess = async (_txHash: string, _referenceId: string) => {
    try {
      // Verify the content after successful payment
      if (storedContentHash && storedHashKey) {
        const verifyData = await verifyContent(storedContentHash, storedHashKey, walletAddress);
        
        if (!verifyData.success) {
          throw new Error('Verification failed');
        }
        
        // Generate a verification ID for tracking
        const mockVerificationId = `verify-${Math.random().toString(36).substring(2, 10)}`;
        
        // Use URLSearchParams to properly encode parameter values
        const queryParams = new URLSearchParams();
        queryParams.set('id', mockVerificationId);
        queryParams.set('hash', storedContentHash);
        queryParams.set('hashKey', storedHashKey);
        queryParams.set('wallet', walletAddress);
        
        // Navigate to results page with hash details
        router.push(`/result?${queryParams.toString()}`);
      }
    } catch (error: any) {
      console.error('Error during verification:', error);
      setError(error.message || 'Verification process failed');
      setProcessingPayment(false);
    }
  };
  
  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setProcessingPayment(false);
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
      setStoredContentHash(storeData.hash);
      setStoredHashKey(storeData.hashKey);
      
      // Start processing payment
      setProcessingPayment(true);
      setLoading(false);
      
    } catch (error: any) {
      console.error('Error during verification:', error);
      setError(error.message || 'Content storage failed');
      setLoading(false);
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
        chain: 'WORLD',
        paymentToken: 'USDC'
      }),
    });
    
    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error || 'Verification failed');
    }
    
    return await verifyResponse.json();
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
      
      {/* Verification form or Payment UI */}
      {!processingPayment ? (
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
                <>Continue to Payment</>
              )}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4">Payment</h2>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          
          <PaymentSelector
            providerId={providerId || ''}
            providerName={provider.name || ''}
            price={provider.price || 0}
            currency={provider.currency || 'USDC'}
            walletAddress={walletAddress}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setProcessingPayment(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Back to content
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
} 