"use client";
import { useState } from 'react';
import { MiniKit, MiniAppWalletAuthErrorPayload } from '@worldcoin/minikit-js';
import { useRouter } from 'next/navigation';

export const WalletAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Please open in World App to connect your wallet');
      return;
    }

    setIsAuthenticating(true);
    try {
      const res = await fetch(`/api/nonce`);
      const { nonce } = await res.json();

      const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: '0', // Optional
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
          // Successfully authenticated
          router.refresh();
          // You can redirect to profile or any other page
        } else {
          alert('Failed to verify wallet authentication');
        }
      }
    } catch (error) {
      console.error('Error in wallet authentication:', error);
      alert('An error occurred during wallet authentication');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <button
      onClick={signInWithWallet}
      disabled={isAuthenticating}
      className="bg-primary text-white w-full py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex justify-center items-center"
    >
      {isAuthenticating ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </span>
      ) : (
        'Link Wallet'
      )}
    </button>
  );
}; 