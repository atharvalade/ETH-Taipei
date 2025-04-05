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
      icon: "📄"
    },
    {
      title: "Payment Processing",
      description: "Service initiates Metal token payment on Base chain for verification services",
      icon: "💰"
    },
    {
      title: "Verification Analysis",
      description: "Smart contracts on Rootstock analyze content patterns and authenticity",
      icon: "🔍"
    },
    {
      title: "Results & Credentials",
      description: "Receive detailed report with authenticity score and option to mint credential NFT",
      icon: "🏆"
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
                apple-card bg-white rounded-xl shadow-md p-6 relative
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                transition-all duration-700 ease-out
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl mb-5 mx-auto z-10">
                {step.icon}
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm border border-white shadow-md z-20">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-center mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 text-center text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 