"use client";

import { motion } from "framer-motion";
import TypewriterComponent from "@/components/ui/typewriter";

export default function MarketplaceHero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[80vh] relative z-10">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Verification Marketplace
          </span>
        </h1>
        
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-xl text-gray-700 leading-relaxed">
            A platform for content creators and verification providers to verify AI-generated content and protect authentic human creations.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button className="rounded-full bg-black px-8 py-3 text-white font-medium hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl">
            Verify Content
          </button>
          <button className="rounded-full bg-white px-8 py-3 text-gray-900 font-medium border border-gray-200 hover:border-gray-400 transition-all shadow-sm hover:shadow-md">
            Explore Providers
          </button>
        </div>
      </div>
      
      {/* Floating elements in background for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-20 w-64 h-64 rounded-full bg-blue-100 opacity-50"></div>
        <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-indigo-100 opacity-30"></div>
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-purple-50 opacity-40"></div>
      </div>
    </div>
  );
} 