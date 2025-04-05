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
      name: "VerifyAI Labs",
      logo: "/images/provider-logos/verifyai.svg", // Placeholder path
      logoColor: "bg-blue-600",
      logoText: "V",
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
      logoColor: "bg-emerald-600",
      logoText: "T",
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
      logoColor: "bg-purple-600",
      logoText: "A",
      accuracy: 96.9,
      speed: 2.5,
      price: 1.7,
      specialty: "Creative Writing",
      description: "Specialized in creative content with stylistic analysis",
      isPopular: false,
    },
    {
      name: "RealText Systems",
      logo: "/images/provider-logos/realtext.svg", // Placeholder path
      logoColor: "bg-orange-600",
      logoText: "R",
      accuracy: 99.2,
      speed: 3.4,
      price: 4.5,
      specialty: "Technical Documentation",
      description: "Highest accuracy for technical documentation verification",
      isPopular: true,
    }
  ];
  
  // Sort providers based on active tab
  const sortedProviders = [...providers].sort((a, b) => {
    if (activeTab === "accuracy") return b.accuracy - a.accuracy;
    if (activeTab === "speed") return a.speed - b.speed;
    if (activeTab === "price") return a.price - b.price;
    return 0;
  });
  
  // Get the best provider for the current comparison criteria
  const getBestProvider = () => {
    if (activeTab === "accuracy") return sortedProviders[0];
    if (activeTab === "speed") return sortedProviders[0];
    if (activeTab === "price") return sortedProviders[0];
    return sortedProviders[0];
  };

  const bestProvider = getBestProvider();
  
  return (
    <div ref={ref} className="w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Verification Providers</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our marketplace creates healthy competition between verification algorithm providers, delivering better results for users.
        </p>
      </div>
      
      {/* Featured provider */}
      <div 
        className={`
          relative mb-16 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-800
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out
        `}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3 text-center md:text-left">
            <div className="inline-flex mb-2 text-xs font-semibold px-3 py-1 bg-indigo-700/50 rounded-full text-indigo-200 backdrop-blur-sm">
              Featured Provider
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-full ${bestProvider.logoColor} flex items-center justify-center text-white font-bold text-2xl`}>
                {bestProvider.logoText}
              </div>
              <h3 className="text-3xl font-bold text-white">{bestProvider.name}</h3>
            </div>
            <p className="text-indigo-100 mb-6">{bestProvider.description}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="rounded-full bg-white text-indigo-900 px-6 py-3 font-medium hover:bg-gray-100 transition-colors shadow-lg">
                Select Provider
              </button>
              <button className="rounded-full bg-indigo-800/80 backdrop-blur-sm text-white px-6 py-3 font-medium border border-indigo-700/50 hover:bg-indigo-800 transition-all">
                View Details
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3 bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:ml-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-bold text-white mb-1">{bestProvider.accuracy}%</div>
                <div className="text-xs text-indigo-200">Accuracy Score</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-bold text-white mb-1">{bestProvider.speed}s</div>
                <div className="text-xs text-indigo-200">Speed</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-bold text-white mb-1">${bestProvider.price}</div>
                <div className="text-xs text-indigo-200">Price per Check</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-xl font-bold text-white mb-1">{bestProvider.specialty}</div>
                <div className="text-xs text-indigo-200">Specialty</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sort Controls */}
      <div 
        className={`
          flex justify-center mb-10
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out delay-200
        `}
      >
        <div className="inline-flex bg-white rounded-xl p-1.5 shadow-md border border-gray-200">
          {["accuracy", "speed", "price"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Sort by {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Provider comparison cards */}
      <div 
        className={`
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out delay-300
        `}
      >
        {sortedProviders.map((provider, index) => (
          <div
            key={provider.name}
            className={`
              bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all 
              ${provider.isPopular ? 'ring-2 ring-indigo-600 ring-offset-2' : 'border border-gray-200'}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {provider.isPopular && (
              <div className="bg-indigo-600 text-white text-xs font-semibold py-1 text-center">
                POPULAR CHOICE
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full ${provider.logoColor} flex items-center justify-center text-white font-bold text-xl mr-3 shadow-md`}>
                  {provider.logoText}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-6">{provider.description}</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="font-semibold text-gray-900">{provider.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${provider.accuracy}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">Speed</span>
                    <span className="font-semibold text-gray-900">{provider.speed}s</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full" 
                      style={{ width: `${(1/provider.speed) * 50}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">Price</span>
                    <span className="font-semibold text-gray-900">${provider.price}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full" 
                      style={{ width: `${(1/provider.price) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-semibold text-gray-900">
                  Specialty: <span className="text-indigo-600">{provider.specialty}</span>
                </div>
              </div>
              
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                Select Provider
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Compare all providers button */}
      <div 
        className={`
          text-center mt-10
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out delay-500
        `}
      >
        <button className="inline-flex items-center justify-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
          Compare all providers
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
} 