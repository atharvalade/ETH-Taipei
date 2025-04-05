"use client";

import { motion } from "framer-motion";
import TypewriterComponent from "@/components/ui/typewriter";

export default function MarketplaceHero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-screen relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="text-center"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Verification Marketplace
          </span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <TypewriterComponent 
            text="A platform for content creators and verification providers to verify AI-generated content and protect authentic human creations."
            delay={40}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <button className="rounded-full bg-black px-8 py-3 text-white font-medium hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl">
            Verify Content
          </button>
          <button className="rounded-full bg-white px-8 py-3 text-gray-900 font-medium border border-gray-200 hover:border-gray-400 transition-all shadow-sm hover:shadow-md">
            Explore Providers
          </button>
        </motion.div>
      </motion.div>
      
      {/* Floating elements in background for visual interest */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="absolute -top-10 -right-20 w-64 h-64 rounded-full bg-blue-100"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 1.8 }}
          className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-indigo-100"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 2.1 }}
          className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-purple-50"
        />
      </div>
    </div>
  );
} 