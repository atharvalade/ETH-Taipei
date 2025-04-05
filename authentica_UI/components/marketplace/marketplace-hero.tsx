"use client";
import { useEffect, useState } from "react";

export default function MarketplaceHero() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center overflow-hidden py-16 md:py-24">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-blue-600/10 blur-xl"></div>
        <div className="absolute top-1/4 -right-10 w-40 h-40 rounded-full bg-purple-600/10 blur-xl"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 rounded-full bg-indigo-600/10 blur-2xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-6xl text-center">
        <h1 
          className={`
            text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            transition-all duration-1000 ease-out
          `}
        >
          Verification <span className="text-gradient font-extrabold">Marketplace</span>
        </h1>
        
        <p 
          className={`
            text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            transition-all duration-1000 ease-out delay-300
          `}
        >
          A platform for content creators and verification providers to verify AI-generated content and protect authentic human creations.
        </p>
        
        <div 
          className={`
            flex flex-wrap items-center justify-center gap-4
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            transition-all duration-1000 ease-out delay-500
          `}
        >
          <button className="rounded-full bg-indigo-600 px-8 py-4 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg clean-shadow">
            Verify Content
          </button>
          <button className="rounded-full bg-white px-8 py-4 text-gray-900 font-medium border border-gray-200 hover:border-indigo-600 transition-all shadow-md clean-shadow">
            Explore Providers
          </button>
        </div>
      </div>
    </div>
  );
} 