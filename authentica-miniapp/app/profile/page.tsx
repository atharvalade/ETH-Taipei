"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Image from "next/image";

// Type definitions for the data
interface NFTCertificate {
  id: string;
  date: string;
  provider: string;
  chain: string;
}

interface UserData {
  verificationCount: number;
  certificates: NFTCertificate[];
  isVerified: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [displayWalletAddress, setDisplayWalletAddress] = useState<string>("");
  const [isWorldApp, setIsWorldApp] = useState(false);
  const [totalVerifications, setTotalVerifications] = useState(0);
  const [nftCertificates, setNftCertificates] = useState<NFTCertificate[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is in World App
    const worldAppInstalled = MiniKit.isInstalled();
    setIsWorldApp(worldAppInstalled);
    
    // Get user data if in World App
    if (worldAppInstalled) {
      // Get username if available
      if (MiniKit.user?.username) {
        setUsername(MiniKit.user.username);
      }
      
      // Get wallet address if available
      if (MiniKit.walletAddress) {
        setWalletAddress(MiniKit.walletAddress);
        // Format for display: 0x1234...5678
        setDisplayWalletAddress(formatWalletAddress(MiniKit.walletAddress));
        
        // Fetch user data from our API
        fetchUserData(MiniKit.walletAddress);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch user data from API
  const fetchUserData = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/user?walletAddress=${walletAddress}`);
      const data = await response.json();
      
      if (data) {
        setTotalVerifications(data.verificationCount || 0);
        setNftCertificates(data.certificates || []);
        setIsVerified(data.isVerified || false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format wallet address to show first 6 and last 4 characters
  const formatWalletAddress = (address: string): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const handleWorldIdVerify = async () => {
    try {
      setIsVerifying(true);
      
      if (!MiniKit.isInstalled()) {
        alert('Please open in World App to verify with World ID');
        setIsVerifying(false);
        return;
      }
      
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "authentica-human-verification", // This must match what you registered in the developer portal
        verification_level: VerificationLevel.Orb
      });
      
      if (finalPayload.status === 'success') {
        // Verify the proof in the backend
        const verifyResponse = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: finalPayload,
            action: "authentica-human-verification",
            signal: walletAddress || undefined,
          }),
        });
        
        const verifyResponseJson = await verifyResponse.json();
        if (verifyResponseJson.status === 200) {
          setIsVerified(true);
          alert('Successfully verified with World ID!');
        } else {
          throw new Error('Server verification failed');
        }
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying with World ID:', error);
      alert('Failed to verify with World ID. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container-mobile flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-3 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-mobile">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold">Profile</h1>
      </motion.div>
      
      {/* User card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-md">
            {(username ? username.charAt(0) : "A").toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{username || "Anonymous User"}</h2>
            
            {displayWalletAddress && (
              <p className="text-sm text-gray-500 font-mono">
                {displayWalletAddress}
              </p>
            )}
            
            <p className="text-sm text-gray-600 mt-1">
              {totalVerifications} Verifications
            </p>
            
            {!isWorldApp && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 py-1 px-2 rounded-full inline-block">
                Open in World App for full features
              </div>
            )}
            
            {isVerified && (
              <div className="mt-2 text-xs text-green-600 bg-green-50 py-1 px-2 rounded-full inline-flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                World ID Verified
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWorldIdVerify}
            disabled={isVerifying || isVerified}
            className={`w-full py-3 rounded-lg flex justify-center items-center font-medium transition-all
              ${isVerified 
                ? "bg-green-500 text-white" 
                : "bg-white border border-gray-200 text-gray-800"}
            `}
          >
            {isVerifying ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : isVerified ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Verified with World ID
              </span>
            ) : (
              <span className="flex items-center">
                <Image
                  src="/World_Logo.png"
                  alt="World ID"
                  width={24}
                  height={24}
                  className="h-5 w-auto mr-2"
                />
                Verify with World ID
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>
      
      {/* NFT Certificates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="font-semibold mb-3">Your NFT Certificates</h3>
        
        <div className="space-y-3">
          {nftCertificates.length > 0 ? (
            nftCertificates.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="card p-3 flex items-center"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.07989 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.07989 21 8.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{nft.id}</h4>
                  <div className="flex text-xs text-gray-500">
                    <span>{nft.date}</span>
                    <span className="mx-1">•</span>
                    <span>{nft.chain}</span>
                  </div>
                </div>
                <button className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12H20M20 12L17 9M20 12L17 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 12C4 9.17157 4 7.75736 4.87868 6.87868C5.75736 6 7.17157 6 10 6H14C16.8284 6 18.2426 6 19.1213 6.87868C20 7.75736 20 9.17157 20 12C20 14.8284 20 16.2426 19.1213 17.1213C18.2426 18 16.8284 18 14 18H10C7.17157 18 5.75736 18 4.87868 17.1213C4 16.2426 4 14.8284 4 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-sm">You don't have any certificates yet</p>
              <p className="text-primary text-xs mt-1">Get verified to receive your first certificate</p>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <button
          onClick={() => router.push('/providers')}
          className="btn-primary w-full"
        >
          Verify New Content
        </button>
        
        {displayWalletAddress && (
          <button
            onClick={() => navigator.clipboard.writeText(walletAddress)}
            className="w-full py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Copy Wallet Address
          </button>
        )}
      </motion.div>
    </div>
  );
} 