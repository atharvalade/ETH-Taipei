"use client";
import { useEffect, useState, useRef } from "react";
import { useInView } from 'react-intersection-observer';

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
  
  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled through the section
      const scrollProgress = (windowHeight - sectionTop) / (sectionHeight + windowHeight);
      
      // Map progress to steps (0-3)
      if (scrollProgress <= 0.25) setActiveStep(0);
      else if (scrollProgress <= 0.5) setActiveStep(1);
      else if (scrollProgress <= 0.75) setActiveStep(2);
      else setActiveStep(3);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial calculation
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const steps = [
    {
      title: "Content Submission",
      description: "Content creator pastes AI-generated content for verification and selects verification type",
      icon: "1",
      partnerName: "World App",
    },
    {
      title: "Payment Processing",
      description: "Service initiates Metal token payment on Base chain for verification services",
      icon: "2",
      partnerName: "Metal",
      partnerLogo: "/images/metal-logo.png", // Placeholder path
    },
    {
      title: "Verification Analysis",
      description: "Smart contracts on Rootstock analyze content patterns and authenticity",
      icon: "3",
      partnerName: "Rootstock",
      partnerLogo: "/images/rootstock-logo.png", // Placeholder path
    },
    {
      title: "Results & Credentials",
      description: "Receive detailed report with authenticity score and option to mint credential NFT",
      icon: "4",
      partnerName: "World App",
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
        <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-gray-900">How It Works</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our streamlined verification process leverages blockchain technology for secure, transparent content verification.
        </p>
      </div>

      <div ref={sectionRef} className="relative pb-24">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-gray-200 z-0"></div>
        
        {/* Moving dot that animates between steps */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black z-20 transition-all duration-700"
          style={{ top: `${activeStep * 25 + 5}%` }}
        ></div>
        
        {/* Steps */}
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`
              relative my-36 first:mt-0 last:mb-0 ${index % 2 === 0 ? 'pr-1/2 text-right' : 'pl-1/2 text-left'}
              ${isVisible ? 'opacity-100' : 'opacity-0'}
              transition-all duration-700 ease-out
            `}
            style={{ 
              transitionDelay: `${index * 150}ms`,
              marginBottom: index === steps.length - 1 ? '0' : '10rem'
            }}
          >
            <div 
              className={`
                ${index % 2 === 0 ? 'mr-8 ml-auto' : 'ml-8 mr-auto'} 
                max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-sm
                ${activeStep === index ? 'border-black' : ''}
                transition-all duration-300
              `}
            >
              <div className={`flex items-start ${index % 2 === 0 ? 'justify-end' : ''} gap-5`}>
                <div className={`order-${index % 2 === 0 ? '2' : '1'} flex-shrink-0`}>
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold
                    ${activeStep === index ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}
                    transition-all duration-300
                  `}>
                    {step.icon}
                  </div>
                </div>
                
                <div className={`order-${index % 2 === 0 ? '1' : '2'} ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <h3 className={`
                    text-xl font-semibold mb-3 
                    ${activeStep === index ? 'text-black' : 'text-gray-800'}
                    transition-colors duration-300
                  `}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  
                  {step.partnerName && (
                    <div className={`flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'} text-sm`}>
                      <span className="text-gray-500 mr-2">Powered by:</span>
                      <div className="flex items-center">
                        {step.partnerLogo ? (
                          <img src={step.partnerLogo} alt={step.partnerName} className="w-4 h-4 mr-1 rounded-full" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-300 mr-1"></div>
                        )}
                        <span className="font-medium text-black">{step.partnerName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Connecting dot */}
            <div className={`
              absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              w-3 h-3 rounded-full
              ${activeStep === index ? 'bg-black' : 'bg-gray-300'}
              transition-all duration-300 z-10
            `}></div>
          </div>
        ))}
      </div>
      
      <div 
        className={`
          bg-gray-100 rounded-xl p-6 mt-16 text-center
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transition-all duration-700 ease-out delay-600
        `}
      >
        <h3 className="text-lg font-semibold mb-3 text-black">Want to learn more about our verification process?</h3>
        <a href="#" className="text-black inline-flex items-center border-b border-black pb-0.5">
          Read our technical whitepaper
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
} 