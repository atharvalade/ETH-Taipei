"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import RootstockPayment from "./RootstockPayment";
import { PayCommandInput, tokenToDecimals, Tokens, MiniKit } from "@worldcoin/minikit-js";

// Interface for component props
interface PaymentSelectorProps {
  providerId: string;
  providerName: string;
  price: number;
  currency: string;
  walletAddress: string;
  onPaymentSuccess: (_txHash: string, _referenceId: string) => void;
  onPaymentError: (_error: string) => void;
}

export default function PaymentSelector({
  providerId,
  providerName,
  price,
  currency,
  walletAddress,
  onPaymentSuccess,
  onPaymentError
}: PaymentSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<'WORLD' | 'ROOTSTOCK'>('WORLD');
  const [loading, setLoading] = useState(false);

  // Process payment via World Chain
  const processWorldPayment = async () => {
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
          currency === 'USDC' ? 
            {
              symbol: Tokens.USDCE,
              token_amount: tokenToDecimals(price, Tokens.USDCE).toString(),
            } : 
            {
              symbol: Tokens.WLD,
              token_amount: tokenToDecimals(price, Tokens.WLD).toString(),
            }
        ],
        description: `Authentica verification by ${providerName}`,
      };
      
      if (!MiniKit.isInstalled()) {
        console.log('MiniKit not installed, simulating payment for development');
        onPaymentSuccess('mock-txhash-for-dev', referenceId);
        return;
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
      
      onPaymentSuccess(finalPayload.transaction_id, referenceId);
      
    } catch (error: any) {
      console.error('Payment processing error:', error);
      onPaymentError(error.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Payment method selector */}
      <div className="mb-5 bg-gray-50 dark:bg-gray-900 rounded-lg p-2 flex border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setPaymentMethod('WORLD')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
            paymentMethod === 'WORLD'
              ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          World Chain
        </button>
        
        <button
          onClick={() => setPaymentMethod('ROOTSTOCK')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
            paymentMethod === 'ROOTSTOCK'
              ? 'bg-white dark:bg-gray-800 text-orange-500 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Rootstock (BTC)
        </button>
      </div>
      
      {/* Payment component based on selection */}
      {paymentMethod === 'WORLD' ? (
        <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3">Pay with World Chain</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Amount:</p>
            <p className="font-medium text-lg">
              {price} {currency}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              For verification by {providerName}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={processWorldPayment}
            className={`w-full py-3 rounded-full font-medium text-sm flex items-center justify-center transition-all ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-primary/20'
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
            ) : (
              'Pay with World App'
            )}
          </motion.button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            Powered by World Chain
          </p>
        </div>
      ) : (
        <RootstockPayment
          providerId={providerId}
          providerName={providerName}
          price={0.001} // Fixed at 0.001 rBTC
          walletAddress={walletAddress}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      )}
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        {paymentMethod === 'WORLD' 
          ? 'Don\'t have the World App? Try Rootstock payment instead.'
          : 'Using MetaMask for payment. Switch back to World Chain for a seamless experience.'}
      </p>
    </div>
  );
} 