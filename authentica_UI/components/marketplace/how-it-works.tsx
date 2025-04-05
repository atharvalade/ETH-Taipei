"use client";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [inView]);
  
  const steps = [
    {
      title: "Content Submission",
      description: "Content creator pastes AI-generated content for verification and selects verification type",
      icon: "📄",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
    },
    {
      title: "Payment Processing",
      description: "Service initiates Metal token payment on Base chain for verification services",
      icon: "💰",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      partnerLogo: "/images/metal-logo.png", // Placeholder path
      partnerName: "Metal",
    },
    {
      title: "Verification Analysis",
      description: "Smart contracts on Rootstock analyze content patterns and authenticity",
      icon: "🔍",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500",
      partnerLogo: "/images/rootstock-logo.png", // Placeholder path
      partnerName: "Rootstock",
    },
    {
      title: "Results & Credentials",
      description: "Receive detailed report with authenticity score and option to mint credential NFT",
      icon: "🏆",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-500",
    }
  ];

  return (
    <div ref={ref} className="w-full">
      <div 
        className={`
          text-center mb-16
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out
        `}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our streamlined verification process leverages blockchain technology for secure, transparent content verification.
        </p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 hidden md:block"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`
                apple-card ${step.bgColor} rounded-2xl shadow-md p-6 relative border ${step.borderColor}
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                transition-all duration-700 ease-out
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl mb-5 mx-auto z-10 shadow-sm">
                {step.icon}
              </div>
              
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm border border-white shadow-md z-20">
                {index + 1}
              </div>
              
              <h3 className="text-lg font-semibold text-center mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 text-center text-sm mb-4">{step.description}</p>
              
              {step.partnerLogo && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                  <div className="flex items-center justify-center">
                    <div className="text-xs text-gray-500 mr-2">Powered by:</div>
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                      {/* This would be an actual image in production */}
                      <div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>
                      <span className="text-xs font-medium text-gray-900">{step.partnerName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div 
        className={`
          bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mt-16 text-center
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out delay-600
        `}
      >
        <h3 className="text-lg font-semibold mb-2 text-indigo-900">Want to learn more about our verification process?</h3>
        <button className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          Read our technical whitepaper
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
} 