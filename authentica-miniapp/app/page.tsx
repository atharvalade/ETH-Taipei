"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MiniKit } from "@worldcoin/minikit-js";

export default function Home() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is in World App and signed in
    const isInWorldApp = MiniKit.isInstalled();
    // For MVP we're assuming the user is signed in if in World App
    if (isInWorldApp) {
      setIsSignedIn(true);
    }
  }, []);
  
  return (
    <div className="container-mobile">
      {/* Header with logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-8 pt-4"
      >
        <Image
          src="/Authentica_SVG.svg"
          alt="Authentica Logo"
          width={180}
          height={45}
          className="w-auto h-auto max-h-14"
          style={{ objectFit: "contain" }}
          priority
        />
      </motion.div>
      
      {/* Intro text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-high-contrast mb-3">
          Verification Marketplace
        </h1>
        <p className="text-medium-contrast text-lg">
          Verify human-created content and mint NFT certificates with our provider marketplace
        </p>
      </motion.div>
      
      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-5 mb-10"
      >
        {[
          {
            title: "Multiple Providers",
            description: "Choose from various AI content detection providers",
            icon: (
              <svg className="text-indigo-500" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ),
            bgClass: "bg-indigo-100 dark:bg-indigo-900/30",
          },
          {
            title: "Pay with Crypto",
            description: "Use World Chain (WRD/USDC) or BTC via Rootstock",
            icon: (
              <svg className="text-blue-500" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15.5 9.5H10.5C9.94772 9.5 9.5 9.94772 9.5 10.5V13.5C9.5 14.0523 9.94772 14.5 10.5 14.5H15.5C16.0523 14.5 16.5 14.0523 16.5 13.5V10.5C16.5 9.94772 16.0523 9.5 15.5 9.5Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13 7.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13 14.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 12H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16.5 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ),
            bgClass: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            title: "NFT Credentials",
            description: "Mint NFTs for verified human-written content",
            icon: (
              <svg className="text-indigo-600" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.07989 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.07989 21 8.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7.5 12.5C8.05228 12.5 8.5 12.0523 8.5 11.5C8.5 10.9477 8.05228 10.5 7.5 10.5C6.94772 10.5 6.5 10.9477 6.5 11.5C6.5 12.0523 6.94772 12.5 7.5 12.5Z" fill="currentColor"/>
                <path d="M7.5 8.5C8.05228 8.5 8.5 8.05228 8.5 7.5C8.5 6.94772 8.05228 6.5 7.5 6.5C6.94772 6.5 6.5 6.94772 6.5 7.5C6.5 8.05228 6.94772 8.5 7.5 8.5Z" fill="currentColor"/>
                <path d="M7.5 16.5C8.05228 16.5 8.5 16.0523 8.5 15.5C8.5 14.9477 8.05228 14.5 7.5 14.5C6.94772 14.5 6.5 14.9477 6.5 15.5C6.5 16.0523 6.94772 16.5 7.5 16.5Z" fill="currentColor"/>
                <path d="M11 8H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 16H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ),
            bgClass: "bg-indigo-100 dark:bg-indigo-900/30",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-start border border-gray-100 dark:border-gray-700"
          >
            <div className={`p-3 ${feature.bgClass} rounded-xl mr-4 flex-shrink-0`}>
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-high-contrast text-lg">{feature.title}</h3>
              <p className="text-sm text-medium-contrast">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/providers')}
          className="bg-primary text-white w-full py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all"
        >
          Get Started
        </motion.button>
        
        <div className="flex justify-center mt-6">
          <Image
            src="/world_logo.svg"
            alt="Powered by World"
            width={120}
            height={30}
            className="h-6 w-auto"
          />
        </div>
      </motion.div>
    </div>
  );
}
