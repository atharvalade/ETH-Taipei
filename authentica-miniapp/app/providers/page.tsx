"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for providers
const mockProviders = [
  {
    id: "provider1",
    name: "RealText Systems",
    description: "Highest accuracy for technical documentation verification",
    price: 5,
    currency: "WRD",
    accuracyScore: 0.992,
    specialty: "Technical Documentation",
    specialtyIcon: "📄",
    logoColor: "#4F46E5", // indigo
    logoBackground: "bg-indigo-600",
    borderColor: "border-indigo-400",
    logoText: "R",
  },
  {
    id: "provider2",
    name: "VerifyAI Labs",
    description: "Cutting edge language pattern recognition with specialized academic focus",
    price: 2.5,
    currency: "USDC",
    accuracyScore: 0.987,
    specialty: "Academic Papers",
    specialtyIcon: "🎓",
    logoColor: "#0EA5E9", // sky blue
    logoBackground: "bg-sky-500",
    borderColor: "border-sky-400",
    logoText: "V",
  },
  {
    id: "provider3",
    name: "TrueContent",
    description: "Industry standard for news verification with real-time fact checking",
    price: 3.8,
    currency: "WRD",
    accuracyScore: 0.975,
    specialty: "News Articles",
    specialtyIcon: "📰",
    logoColor: "#000000", // black
    logoBackground: "bg-black",
    borderColor: "border-gray-400",
    logoText: "T",
  },
  {
    id: "provider4",
    name: "AuthentiCheck",
    description: "Specialized in creative content with stylistic analysis",
    price: 0.0001,
    currency: "BTC",
    accuracyScore: 0.969,
    specialty: "Creative Writing",
    specialtyIcon: "✍️",
    logoColor: "#9333EA", // purple
    logoBackground: "bg-purple-600",
    borderColor: "border-purple-400",
    logoText: "A",
  }
];

export default function ProvidersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("accuracy");
  const [providers, setProviders] = useState(mockProviders);
  
  // Sort providers based on active tab
  useEffect(() => {
    const sortedProviders = [...mockProviders].sort((a, b) => {
      if (activeTab === "accuracy") return b.accuracyScore - a.accuracyScore;
      if (activeTab === "price") return a.price - b.price;
      return 0;
    });
    
    setProviders(sortedProviders);
  }, [activeTab]);
  
  return (
    <div className="container-mobile">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-center text-high-contrast">Verification Providers</h1>
        <p className="text-sm text-center text-medium-contrast mt-1">
          Select a provider to verify your content
        </p>
      </motion.div>
      
      {/* Filter tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex bg-white dark:bg-gray-800/60 p-1 rounded-full shadow-md">
          <button
            className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
              activeTab === "accuracy" 
                ? "bg-primary text-white shadow-lg" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("accuracy")}
          >
            Accuracy
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
              activeTab === "price" 
                ? "bg-primary text-white shadow-lg" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("price")}
          >
            Price
          </button>
        </div>
      </motion.div>
      
      {/* Provider cards */}
      <div className="space-y-5 mb-6">
        <AnimatePresence mode="wait">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 + (index * 0.05) }}
              className="rounded-2xl overflow-hidden"
              style={{ 
                borderRadius: '16px',
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.05)`,
              }}
            >
              {/* Provider card with border color */}
              <motion.div 
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/verify?providerId=${provider.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 relative"
                style={{ 
                  borderTopWidth: '4px',
                  borderTopColor: provider.logoColor,
                }}
              >
                {/* Provider header */}
                <div className="flex items-center p-4">
                  <div className={`w-12 h-12 rounded-full ${provider.logoBackground} flex items-center justify-center text-white font-bold text-xl shadow-md mr-3`}>
                    {provider.logoText}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-high-contrast">{provider.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                        {(provider.accuracyScore * 100).toFixed(1)}% Accuracy
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Provider details */}
                <div className="px-4 pb-4">
                  <p className="text-sm text-medium-contrast mb-3">
                    {provider.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full flex items-center">
                        <span className="mr-1">{provider.specialtyIcon}</span>
                        <span className="text-xs text-medium-contrast">{provider.specialty}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-high-contrast text-lg">{provider.price} {provider.currency}</span>
                      <div className="text-xs text-low-contrast">per check</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 