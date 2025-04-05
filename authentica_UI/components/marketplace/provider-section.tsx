"use client";

import { useState } from "react";

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
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Verification Providers</h2>
        <p className="text-xl text-gray-900 max-w-3xl mx-auto font-medium">
          Our marketplace creates healthy competition between verification algorithm providers, delivering better results for users.
        </p>
      </div>
      
      {/* Tabs for different sorting options */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-sm border-2 border-gray-300">
          {["accuracy", "speed", "price"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === tab 
                  ? "bg-indigo-900 text-white shadow-md border border-indigo-900" 
                  : "text-gray-900 hover:bg-gray-200 border border-gray-300"
              }`}
            >
              Sort by {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Provider cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sortedProviders.map((provider) => (
          <div
            key={provider.name}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-300"
          >
            <div className="h-2 bg-indigo-900"></div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-900 flex items-center justify-center text-white font-bold text-xl mr-3">
                  {provider.logo}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-900 font-medium">Accuracy</span>
                    <span className="font-bold text-gray-900">{provider.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                    <div 
                      className="h-full bg-green-600 rounded-full" 
                      style={{ width: `${provider.accuracy}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-900 font-medium">Speed</span>
                    <span className="font-bold text-gray-900">{provider.speed}s</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${(1/provider.speed) * 50}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-900 font-medium">Price</span>
                    <span className="font-bold text-gray-900">${provider.price}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                    <div 
                      className="h-full bg-orange-600 rounded-full" 
                      style={{ width: `${(1/provider.price) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm font-bold text-gray-900 mb-4">
                Specialty: {provider.specialty}
              </div>
              
              <button className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2 rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 