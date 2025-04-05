"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { MiniKit } from "@worldcoin/minikit-js";

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
  const providerId = searchParams.get('providerId');
  
  const [provider, setProvider] = useState<any>(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [chain, setChain] = useState<'WORLD' | 'ROOTSTOCK'>('WORLD');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  
  // Load provider details
  useEffect(() => {
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
      // Check if MiniKit is available (running in World App)
      if (MiniKit.isInstalled()) {
        // We're in World App, let's start verification process
        
        // Since we're just prototyping, we'll simulate a successful verification
        // In a production app, you would:
        // 1. Call your API to create a verification request
        // 2. Get a payment amount/address from the provider
        // 3. Redirect to payment
        
        // Generate a random verification ID
        const mockVerificationId = `verify-${Math.random().toString(36).substring(2, 10)}`;
        setVerificationId(mockVerificationId);
        
        // Navigate to results page with this ID
        // In a real app, we would navigate to a payment page first
        setTimeout(() => {
          router.push(`/result?id=${mockVerificationId}`);
        }, 1000);
      } else {
        // For testing outside World App
        console.log('Not in World App, simulating verification...');
        
        // Simulate verification without World App integration
        setTimeout(() => {
          const mockVerificationId = `verify-${Math.random().toString(36).substring(2, 10)}`;
          setVerificationId(mockVerificationId);
          router.push(`/result?id=${mockVerificationId}`);
        }, 1000);
      }
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
          <label htmlFor="chain" className="block text-sm font-medium text-medium-contrast mb-2">
            Blockchain for Payment & Verification
          </label>
          <select
            id="chain"
            value={chain}
            onChange={handleChainChange}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={loading}
          >
            <option value="WORLD">World Chain (WRD/USDC)</option>
            <option value="ROOTSTOCK">Rootstock (BTC)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-medium-contrast mb-2">
            Content to Verify
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the text you want to verify..."
            className="w-full p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary h-40"
            disabled={loading}
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="bg-primary text-white w-full py-4 rounded-full font-medium shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {loading ? 'Processing...' : `Pay ${provider.price} ${provider.currency} & Verify`}
        </motion.button>
        
        <p className="text-xs text-center text-low-contrast mt-4">
          By proceeding, the content will be hashed and stored on IPFS.
          Payment will be processed via {chain === 'WORLD' ? 'World Chain' : 'Rootstock'}.
        </p>
      </motion.form>
    </div>
  );
} 