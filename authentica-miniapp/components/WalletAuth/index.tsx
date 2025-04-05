"use client";
import { useState, useEffect } from 'react';
import { MiniKit, MiniAppWalletAuthErrorPayload } from '@worldcoin/minikit-js';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export const WalletAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Check if user is already connected
  useEffect(() => {
    if (MiniKit.isInstalled() && MiniKit.walletAddress) {
      setIsSuccess(true);
    }
  }, []);

  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Please open in World App to connect your wallet');
      return;
    }

    if (isSuccess) {
      router.push('/providers');
      return;
    }

    setIsAuthenticating(true);
    try {
      const res = await fetch(`/api/nonce`);
      const { nonce } = await res.json();

      const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: crypto.randomUUID().substring(0, 8),
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: 'Link your wallet to Authentica to verify your identity',
      });

      if (finalPayload.status === 'error') {
        console.error('Error authenticating wallet');
        alert('Failed to authenticate wallet. Please try again.');
        return;
      } else {
        const response = await fetch('/api/complete-siwe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: finalPayload,
            nonce,
          }),
        });

        const result = await response.json();
        if (result.status === 'success' && result.isValid) {
          // Success animation
          setIsSuccess(true);
          
          // Redirect after a short delay to show success animation
          setTimeout(() => {
            router.refresh();
            // You can redirect to profile or providers page
            router.push('/profile');
          }, 1500);
        } else {
          alert('Failed to verify wallet authentication');
        }
      }
    } catch (error) {
      console.error('Error in wallet authentication:', error);
      alert('An error occurred during wallet authentication');
    } finally {
      !isSuccess && setIsAuthenticating(false);
    }
  };

  return (
    <motion.button
      onClick={signInWithWallet}
      disabled={isAuthenticating && !isSuccess}
      whileHover={!isAuthenticating && !isSuccess ? { scale: 1.02 } : {}}
      whileTap={!isAuthenticating && !isSuccess ? { scale: 0.98 } : {}}
      className={`w-full py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-primary/20 transition-all flex justify-center items-center
        ${isSuccess 
          ? "bg-green-500 text-white" 
          : "bg-primary text-white"}`}
    >
      {isAuthenticating && !isSuccess ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </span>
      ) : isSuccess ? (
        <motion.span 
          className="flex items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <motion.svg 
            className="mr-2 h-6 w-6 text-white" 
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M7 13L10 16L17 9" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <motion.circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />
          </motion.svg>
          Wallet Connected
        </motion.span>
      ) : (
        'Link Wallet'
      )}
    </motion.button>
  );
}; 