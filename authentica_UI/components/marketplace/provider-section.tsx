"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ProviderSection() {
  const [activeTab, setActiveTab] = useState("accuracy");
  
  const providers = [
    {
      name: "VerifyAI Labs",
      accuracy: 98.7,
      speed: 1.2,
      price: 2.5,
      specialty: "Academic Papers",
      logo: "V"
    },
    {
      name: "TrueContent",
      accuracy: 97.5,
      speed: 0.8,
      price: 3.8,
      specialty: "News Articles",
      logo: "T"
    },
    {
      name: "AuthentiCheck",
      accuracy: 96.9,
      speed: 2.5,
      price: 1.7,
      specialty: "Creative Writing",
      logo: "A"
    },
    {
      name: "RealText Systems",
      accuracy: 99.2,
      speed: 3.4,
      price: 4.5,
      specialty: "Technical Documentation",
      logo: "R"
    }
  ];
  
  // Sort providers based on active tab
  const sortedProviders = [...providers].sort((a, b) => {
    if (activeTab === "accuracy") return b.accuracy - a.accuracy;
    if (activeTab === "speed") return a.speed - b.speed;
    if (activeTab === "price") return a.price - b.price;
    return 0;
  });
  
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Verification Providers</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our marketplace creates healthy competition between verification algorithm providers, delivering better results for users.
          </p>
        </motion.div>
        
        {/* Tabs for different sorting options */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-sm">
            {["accuracy", "speed", "price"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                  activeTab === tab 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sort by {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Provider cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProviders.map((provider, index) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl mr-3">
                    {provider.logo}
                  </div>
                  <h3 className="text-lg font-bold">{provider.name}</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Accuracy</span>
                      <span className="font-medium">{provider.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${provider.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Speed</span>
                      <span className="font-medium">{provider.speed}s</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(1/provider.speed) * 50}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium">${provider.price}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${(1/provider.price) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm font-medium text-gray-600 mb-4">
                  Specialty: {provider.specialty}
                </div>
                
                <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 