"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Image from "next/image";

// Mock NFT certificates for demo
const mockNFTCertificates = [
  {
    id: "AUTH-123456",
    date: "2023-04-01",
    provider: "RealText Systems",
    chain: "WORLD",
  },
  {
    id: "AUTH-789012",
    date: "2023-03-15",
    provider: "VerifyAI Labs",
    chain: "WORLD",
  },
  {
    id: "AUTH-345678",
    date: "2023-02-10",
    provider: "TrueContent",
    chain: "ROOTSTOCK",
  }
];

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isWorldApp, setIsWorldApp] = useState(false);
  const [totalVerifications, setTotalVerifications] = useState(0);
  const [nftCertificates, setNftCertificates] = useState(mockNFTCertificates);
  
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
        setWalletAddress(formatWalletAddress(MiniKit.walletAddress));
      }
      
      // In a real app, we would fetch verifications count and NFT data from our backend
      // For demo, we'll set random verification count
      setTotalVerifications(Math.floor(Math.random() * 10) + 5);
    }
  }, []);
  
  // Format wallet address to show first 6 and last 4 characters
  const formatWalletAddress = (address: string): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const handleWorldIdVerify = async () => {
    try {
      if (MiniKit.isInstalled()) {
        const { finalPayload } = await MiniKit.commandsAsync.verify({
          action: "World_MiniApp",
          verification_level: VerificationLevel.Orb
        });
        
        if (finalPayload.status === 'success') {
          alert('Successfully verified with World ID!');
        } else {
          throw new Error('Verification failed');
        }
      } else {
        alert('Please open in World App to verify with World ID');
      }
    } catch (error) {
      console.error('Error verifying with World ID:', error);
      alert('Failed to verify with World ID');
    }
  };
  
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
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mr-4">
            {(username ? username.charAt(0) : "A").toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{username || "Anonymous User"}</h2>
            
            {walletAddress && (
              <p className="text-sm text-gray-500">
                {walletAddress}
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
          </div>
        </div>
        
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWorldIdVerify}
            className="bg-white border border-gray-200 w-full py-3 rounded-lg flex justify-center items-center font-medium"
          >
            <Image
              src="/World_Logo.png"
              alt="World ID"
              width={24}
              height={24}
              className="h-5 w-auto mr-2"
            />
            Verify with World ID
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
          {nftCertificates.map((nft, index) => (
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
              <button className="text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => router.push('/providers')}
          className="btn-primary w-full"
        >
          Verify New Content
        </button>
      </motion.div>
    </div>
  );
} 