"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Interface for component props
interface RootstockPaymentProps {
  providerId: string;
  providerName: string;
  price: number; // Price is fixed at 0.001 rBTC
  walletAddress: string;
  onPaymentSuccess: (_txHash: string, _referenceId: string) => void;
  onPaymentError: (_error: string) => void;
}

export default function RootstockPayment({
  providerId: _providerId,
  providerName,
  price: _price,
  walletAddress,
  onPaymentSuccess,
  onPaymentError
}: RootstockPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [deepLink, setDeepLink] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  
  // Fixed contract address for the Rootstock payment receiver
  const ROOTSTOCK_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ROOTSTOCK_CONTRACT_ADDRESS || "0x...";
  
  // Get provider name for display
  const formattedProviderName = providerName || "Provider";
  
  // Initialize payment on component mount
  useEffect(() => {
    initializePayment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Function to check for payment status
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (referenceId && !txHash) {
      // Poll for transaction status every 10 seconds
      intervalId = setInterval(async () => {
        try {
          // Get the API URL from environment variables, fallback to relative URL for local dev
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
          
          const statusResponse = await fetch(`${apiUrl}/payment-status?referenceId=${referenceId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            
            if (statusData.status === 'completed' && statusData.txHash) {
              clearInterval(intervalId);
              setTxHash(statusData.txHash);
              onPaymentSuccess(statusData.txHash, referenceId);
            }
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [referenceId, txHash, onPaymentSuccess]);
  
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
      
      // Generate deep link for MetaMask
      const link = generateMetaMaskDeepLink(walletAddress, newReferenceId);
      setDeepLink(link);
      
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setErrorMessage(error.message || 'Failed to initialize payment');
      onPaymentError(error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate a deep link for MetaMask mobile
  const generateMetaMaskDeepLink = (userAddress: string, refId: string): string => {
    // Function signature for payForVerification(address _userAddress, bytes32 _referenceId)
    const functionSignature = "0xb8170e5d"; // keccak256("payForVerification(address,bytes32)").slice(0, 10)
    
    // Encode address parameter (pad to 32 bytes)
    const encodedAddress = userAddress.toLowerCase().replace('0x', '').padStart(64, '0');
    
    // Encode bytes32 parameter (reference ID)
    let encodedReferenceId = '';
    try {
      // Convert string to bytes32
      const bytes = new TextEncoder().encode(refId);
      const bytesHex = Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      encodedReferenceId = bytesHex.padEnd(64, '0');
    } catch (error) {
      // Fallback encoding
      encodedReferenceId = refId.padStart(64, '0');
    }
    
    // Combine function signature and encoded parameters
    const data = `${functionSignature}${encodedAddress}${encodedReferenceId}`;
    
    // Create transaction parameters
    const txParams = {
      to: ROOTSTOCK_CONTRACT_ADDRESS,
      from: userAddress, // This might be ignored by MetaMask
      value: (0.001 * 1e18).toString(10), // 0.001 rBTC in wei (decimal string)
      data: data,
      chainId: 31, // Rootstock testnet
    };
    
    // Encode the transaction parameters as URL parameters
    const encodedTx = encodeURIComponent(JSON.stringify(txParams));
    
    // Create the deep link URL
    return `metamask://wc?uri=${encodedTx}`;
  };
  
  // Handle deep link click
  const handleDeepLinkClick = () => {
    // Open MetaMask app via deep link
    window.location.href = deepLink;
  };
  
  // Toggle QR code display
  const toggleQRCode = () => {
    setShowQR(!showQR);
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
      
      {showQR && deepLink && (
        <div className="mb-4 flex justify-center">
          <div className="p-4 bg-white rounded-lg">
            {/* For simplicity in this MVP, we mention QR code would go here.
                In production, we would properly implement QR code rendering. */}
            <div className="flex items-center justify-center w-[200px] h-[200px] border border-gray-200 rounded">
              <p className="text-sm text-center text-gray-600">QR Code for MetaMask</p>
            </div>
            <p className="text-xs text-center mt-2 text-gray-500">Scan with MetaMask mobile</p>
          </div>
        </div>
      )}
      
      {deepLink && !txHash && (
        <div className="flex flex-col space-y-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={handleDeepLinkClick}
            className="w-full py-3 rounded-full font-medium text-sm flex items-center justify-center transition-all bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/20"
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
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 784 784" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M392 784C608.28 784 784 608.28 784 392C784 175.72 608.28 0 392 0C175.72 0 0 175.72 0 392C0 608.28 175.72 784 392 784Z" fill="#24292E"/>
                  <path d="M392 163.333L261.333 359.733L392 294.267V163.333Z" fill="#FFFFFF"/>
                  <path d="M392 294.267L261.333 359.733L392 457.333V294.267Z" fill="#FFFFFF"/>
                  <path d="M522.667 359.733L392 163.333V294.267L522.667 359.733Z" fill="#FFFFFF"/>
                  <path d="M392 457.333L522.667 359.733L392 294.267V457.333Z" fill="#FFFFFF"/>
                  <path d="M261.333 392.533L392 620.667V490L261.333 392.533Z" fill="#FFFFFF"/>
                  <path d="M392 490V620.667L522.667 392.533L392 490Z" fill="#FFFFFF"/>
                </svg>
                Open in MetaMask
              </>
            )}
          </motion.button>
          
          <button
            onClick={toggleQRCode}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
          >
            {showQR ? "Hide QR Code" : "Show QR Code"}
          </button>
        </div>
      )}
      
      {txHash && (
        <div className="mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-green-700 dark:text-green-300 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Payment Complete
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Powered by Rootstock (RSK) &amp; Hyperlane
      </p>
    </div>
  );
} 