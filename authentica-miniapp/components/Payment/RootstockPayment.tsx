"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Declare global ethereum property on window
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Interface for component props
interface RootstockPaymentProps {
  providerId: string;
  providerName: string;
  price: number; // Price is fixed at 0.001 rBTC
  walletAddress: string;
  onPaymentSuccess: (txHash: string, referenceId: string) => void;
  onPaymentError: (error: string) => void;
}

export default function RootstockPayment({
  providerId,
  providerName,
  price,
  walletAddress,
  onPaymentSuccess,
  onPaymentError
}: RootstockPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Fixed contract address for the Rootstock payment receiver
  const ROOTSTOCK_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS || "0x..."; 
  
  // Get provider name for display
  const formattedProviderName = providerName || "Provider";
  
  // Initialize payment on component mount
  useEffect(() => {
    initializePayment();
  }, []);
  
  // Initialize payment by getting a reference ID from the backend
  const initializePayment = async () => {
    try {
      setLoading(true);
      
      // Get the API URL from environment variables, fallback to relative URL for local dev
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      
      // Step 1: Initiate payment and get reference ID
      const initiateResponse = await fetch(`${apiUrl}/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          paymentMethod: 'rbtc',
        }),
      });
      
      if (!initiateResponse.ok) {
        throw new Error('Failed to initiate payment');
      }
      
      const { id: newReferenceId } = await initiateResponse.json();
      setReferenceId(newReferenceId);
      
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setErrorMessage(error.message || 'Failed to initialize payment');
      onPaymentError(error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };
  
  // Process payment via Rootstock
  const processPayment = async () => {
    try {
      setLoading(true);
      
      // Check if user has Rootstock-compatible wallet (MetaMask)
      if (!window.ethereum) {
        throw new Error('No Ethereum wallet detected. Please install MetaMask');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet');
      }
      
      const userAccount = accounts[0];
      
      // Check if user is on the correct network (Rootstock testnet)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== '0x1f') { // Rootstock testnet chainId is 31 (0x1f in hex)
        try {
          // Try to switch to Rootstock testnet
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1f' }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x1f',
                    chainName: 'RSK Testnet',
                    nativeCurrency: {
                      name: 'tRBTC',
                      symbol: 'tRBTC',
                      decimals: 18,
                    },
                    rpcUrls: ['https://public-node.testnet.rsk.co'],
                    blockExplorerUrls: ['https://explorer.testnet.rsk.co'],
                  },
                ],
              });
            } catch (addError) {
              throw new Error('Failed to add Rootstock network to your wallet');
            }
          } else {
            throw new Error('Failed to switch to Rootstock network');
          }
        }
      }
      
      // Create transaction parameters with proper function signature encoding
      const txParams = {
        from: userAccount,
        to: ROOTSTOCK_CONTRACT_ADDRESS,
        value: '0x' + (0.001 * 1e18).toString(16), // 0.001 rBTC in wei (hex)
        data: encodePaymentData(walletAddress, referenceId),
      };
      
      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
      
      setTxHash(txHash);
      
      // Call success callback
      onPaymentSuccess(txHash, referenceId);
      
    } catch (error: any) {
      console.error('Payment processing error:', error);
      setErrorMessage(error.message || 'Failed to process payment');
      onPaymentError(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };
  
  // Encode the payment data for the smart contract call
  const encodePaymentData = (userAddress: string, referenceId: string) => {
    try {
      // Function signature for payForVerification(address _userAddress, bytes32 _referenceId)
      const functionSignature = "0xb8170e5d"; // keccak256("payForVerification(address,bytes32)").slice(0, 10)
      
      // Encode address parameter (pad to 32 bytes)
      const encodedAddress = userAddress.toLowerCase().replace('0x', '').padStart(64, '0');
      
      // Encode bytes32 parameter (reference ID)
      // Convert string to bytes32 hex format
      let encodedReferenceId = '';
      if (referenceId.startsWith('0x') && referenceId.length === 66) {
        // Already a bytes32 hex
        encodedReferenceId = referenceId.slice(2);
      } else {
        // Convert string to bytes32
        const bytes = new TextEncoder().encode(referenceId);
        const bytesHex = Array.from(bytes)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        encodedReferenceId = bytesHex.padEnd(64, '0');
      }
      
      // Combine function signature and encoded parameters
      return `${functionSignature}${encodedAddress}${encodedReferenceId}`;
    } catch (error) {
      console.error('Error encoding function data:', error);
      // Fallback to simpler encoding in case of error
      const functionSignature = "0xb8170e5d";
      const encodedAddress = userAddress.replace('0x', '').padStart(64, '0');
      const encodedReferenceId = referenceId.padStart(64, '0');
      return `${functionSignature}${encodedAddress}${encodedReferenceId}`;
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3">Pay with Rootstock (rBTC)</h3>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md text-red-700 dark:text-red-400 text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Amount:</p>
        <p className="font-medium text-lg">0.001 rBTC</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          For verification by {formattedProviderName}
        </p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Payment to:</p>
        <p className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
          {ROOTSTOCK_CONTRACT_ADDRESS}
        </p>
      </div>
      
      {referenceId && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Reference ID:</p>
          <p className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
            {referenceId}
          </p>
        </div>
      )}
      
      {txHash && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Transaction:</p>
          <a 
            href={`https://explorer.testnet.rsk.co/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-blue-500 hover:text-blue-700 bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 block overflow-x-auto"
          >
            {txHash}
          </a>
        </div>
      )}
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading || !referenceId || !!txHash}
        onClick={processPayment}
        className={`w-full py-3 rounded-full font-medium text-sm flex items-center justify-center transition-all ${
          loading || !referenceId || !!txHash
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/20'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : txHash ? (
          'Payment Complete ✓'
        ) : (
          'Pay with MetaMask'
        )}
      </motion.button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Powered by Rootstock (RSK) &amp; Hyperlane
      </p>
    </div>
  );
} 