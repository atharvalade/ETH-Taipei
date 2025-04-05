"use client";

import { useState, useEffect } from "react";
import { useInView } from 'react-intersection-observer';

export default function ProviderSection() {
  const [activeTab, setActiveTab] = useState("accuracy");
  const [isVisible, setIsVisible] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [inView]);
  
  const providers = [
    {
      name: "RealText Systems",
      logo: "/images/provider-logos/realtext.svg", // Placeholder path
      logoText: "R",
      logoColor: "#000",
      accuracy: 99.2,
      speed: 3.4,
      price: 4.5,
      specialty: "Technical Documentation",
      description: "Highest accuracy for technical documentation verification",
      isPopular: true,
    },
    {
      name: "VerifyAI Labs",
      logo: "/images/provider-logos/verifyai.svg", // Placeholder path
      logoText: "V",
      logoColor: "#000",
      accuracy: 98.7,
      speed: 1.2,
      price: 2.5,
      specialty: "Academic Papers",
      description: "Cutting edge language pattern recognition with specialized academic focus",
      isPopular: true,
    },
    {
      name: "TrueContent",
      logo: "/images/provider-logos/truecontent.svg", // Placeholder path
      logoText: "T",
      logoColor: "#000",
      accuracy: 97.5,
      speed: 0.8,
      price: 3.8,
      specialty: "News Articles",
      description: "Industry standard for news verification with real-time fact checking",
      isPopular: false,
    },
    {
      name: "AuthentiCheck",
      logo: "/images/provider-logos/authenticheck.svg", // Placeholder path
      logoText: "A",
      logoColor: "#000",
      accuracy: 96.9,
      speed: 2.5,
      price: 1.7,
      specialty: "Creative Writing",
      description: "Specialized in creative content with stylistic analysis",
      isPopular: false,
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
    <div ref={ref} className="w-full">
      <div 
        className={`
          text-center mb-16
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out
        `}
      >
        <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-gray-900">Verification Providers</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our marketplace creates healthy competition between verification algorithm providers, delivering better results for users.
        </p>
      </div>
      
      {/* Sort Controls */}
      <div 
        className={`
          mb-12
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out delay-200
        `}
      >
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-lg">
            {["accuracy", "speed", "price"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? "bg-black text-white" 
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sort by {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Apple-style product comparison grid */}
      <div 
        className={`
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out delay-300
        `}
      >
        <div className="overflow-hidden">
          <div className="relative">
            {/* Header row */}
            <div className="grid grid-cols-5 gap-0.5 mb-0.5">
              <div className="bg-white p-6 rounded-tl-xl"></div>
              {sortedProviders.map((provider, index) => (
                <div key={`header-${provider.name}`} className={`bg-white p-4 text-center ${index === 0 ? 'rounded-tr-xl' : ''}`}>
                  {provider.isPopular && (
                    <div className="mb-2 text-xs font-semibold text-white bg-black py-1 px-2 rounded inline-block">
                      POPULAR CHOICE
                    </div>
                  )}
                  <div className="h-16 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg">
                      {provider.logoText}
                    </div>
                  </div>
                  <h3 className="text-base font-semibold mt-2 mb-1 text-black">{provider.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-1">{provider.specialty}</p>
                </div>
              ))}
            </div>
            
            {/* Accuracy row */}
            <div className="grid grid-cols-5 gap-0.5 mb-0.5">
              <div className="bg-white p-6 flex items-center">
                <span className="font-medium text-black">Accuracy</span>
              </div>
              {sortedProviders.map((provider) => (
                <div key={`accuracy-${provider.name}`} className="bg-white p-6 text-center">
                  <span className="text-xl font-medium text-black">{provider.accuracy}%</span>
                </div>
              ))}
            </div>
            
            {/* Speed row */}
            <div className="grid grid-cols-5 gap-0.5 mb-0.5">
              <div className="bg-white p-6 flex items-center">
                <span className="font-medium text-black">Speed</span>
              </div>
              {sortedProviders.map((provider) => (
                <div key={`speed-${provider.name}`} className="bg-white p-6 text-center">
                  <span className="text-xl font-medium text-black">{provider.speed}s</span>
                </div>
              ))}
            </div>
            
            {/* Price row */}
            <div className="grid grid-cols-5 gap-0.5 mb-0.5">
              <div className="bg-white p-6 flex items-center">
                <span className="font-medium text-black">Price per check</span>
              </div>
              {sortedProviders.map((provider) => (
                <div key={`price-${provider.name}`} className="bg-white p-6 text-center">
                  <span className="text-xl font-medium text-black">${provider.price}</span>
                </div>
              ))}
            </div>
            
            {/* Specialty row */}
            <div className="grid grid-cols-5 gap-0.5 mb-0.5">
              <div className="bg-white p-6 flex items-center">
                <span className="font-medium text-black">Specialty</span>
              </div>
              {sortedProviders.map((provider) => (
                <div key={`specialty-${provider.name}`} className="bg-white p-6 text-center">
                  <span className="font-medium text-black">{provider.specialty}</span>
                </div>
              ))}
            </div>
            
            {/* Button row */}
            <div className="grid grid-cols-5 gap-0.5">
              <div className="bg-white p-6 rounded-bl-xl"></div>
              {sortedProviders.map((provider, index) => (
                <div key={`button-${provider.name}`} className={`bg-white p-6 text-center ${index === 0 ? 'rounded-br-xl' : ''}`}>
                  <button className="py-2 px-4 bg-black text-white text-sm font-medium rounded-full">
                    Select Provider
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Compare all providers button */}
      <div 
        className={`
          text-center mt-8
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out delay-500
        `}
      >
        <a href="#" className="text-black inline-flex items-center border-b border-black pb-0.5">
          Compare all providers
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
} 