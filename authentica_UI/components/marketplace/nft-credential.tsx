"use client";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';

export default function NFTCredential() {
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

  return (
    <div ref={ref} className="relative z-10 max-w-6xl mx-auto text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <div 
          className={`
            text-center mb-16
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            transition-all duration-700 ease-out
          `}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">NFT Credentials for Human Creation</h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Protect your authentic human-created content with blockchain-backed NFT credentials
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* NFT Display */}
          <div 
            className={`
              md:w-1/2 order-2 md:order-1
              ${isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-6'}
              transition-all duration-1000 ease-out delay-300
            `}
          >
            <div className="relative perspective-card mx-auto max-w-md">
              {/* 3D NFT Card with hover effects */}
              <div className="relative nft-card animate-subtle-glow">
                {/* Certificate backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-800 to-purple-800 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/nft-pattern.svg')] opacity-20"></div>
                </div>
                
                {/* Certificate content */}
                <div className="relative p-8 flex flex-col items-center">
                  {/* Certificate header */}
                  <div className="flex items-center justify-between w-full mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Authentica</h3>
                        <div className="text-xs text-indigo-200">Verified Human Creation</div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                      <div className="text-xs font-mono text-indigo-100">#A728F9</div>
                    </div>
                  </div>
                  
                  {/* Certificate hologram */}
                  <div className="relative w-32 h-32 my-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 animate-spin-slow blur-sm"></div>
                    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Certificate title */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-1 text-white">Authenticity Certificate</h3>
                    <div className="text-sm text-indigo-200 font-medium">Human Creation Verified</div>
                  </div>
                  
                  {/* Certificate details */}
                  <div className="w-full grid grid-cols-2 gap-4 text-center mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-xs text-indigo-200 mb-1">Confidence Score</div>
                      <div className="text-xl font-bold text-white">98.7%</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-xs text-indigo-200 mb-1">Issued Date</div>
                      <div className="text-sm font-bold text-white">June 12, 2023</div>
                    </div>
                  </div>
                  
                  {/* Certificate footer */}
                  <div className="w-full flex items-center justify-between text-indigo-200 text-xs">
                    <div>blockchain.authentica.io</div>
                    <div className="font-mono">0x71C...8F3D</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Benefits text */}
          <div 
            className={`
              md:w-1/2 order-1 md:order-2
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              transition-all duration-700 ease-out
            `}
          >
            <h3 className="text-2xl font-bold mb-6 md:text-left text-center">Benefits of NFT Credentials</h3>
            <p className="text-indigo-100 mb-8 md:text-left text-center">
              When human-created content is verified with a confidence score above 95%, 
              creators can mint an NFT credential as proof of authenticity.
            </p>
            <ul className="space-y-6 mb-10">
              <li 
                className={`
                  flex items-start
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                  transition-all duration-700 ease-out delay-100
                `}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Verifiable Proof of Human Creation</h4>
                  <p className="text-indigo-100 text-sm">
                    Blockchain-based verification provides indisputable evidence that your content was created by a human, not AI.
                  </p>
                </div>
              </li>
              <li 
                className={`
                  flex items-start
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                  transition-all duration-700 ease-out delay-200
                `}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Protect Intellectual Property</h4>
                  <p className="text-indigo-100 text-sm">
                    Establish clear ownership and provenance for your creative works, preventing unauthorized AI-generated replicas.
                  </p>
                </div>
              </li>
              <li 
                className={`
                  flex items-start
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                  transition-all duration-700 ease-out delay-300
                `}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Seamless Sharing & Embedding</h4>
                  <p className="text-indigo-100 text-sm">
                    Easily share your verification credentials across platforms or embed them directly into your website or portfolio.
                  </p>
                </div>
              </li>
            </ul>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                className={`
                  rounded-full bg-white text-indigo-900 px-6 py-3 font-medium shadow-lg
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                  transition-all duration-700 ease-out delay-400
                `}
              >
                Mint Your NFT
              </button>
              <button 
                className={`
                  rounded-full bg-indigo-600/30 backdrop-blur-sm text-white px-6 py-3 font-medium border border-indigo-400/30
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                  transition-all duration-700 ease-out delay-500
                `}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to your CSS file (animations.css)
// .perspective-card {
//   perspective: 1000px;
// }
// 
// .nft-card {
//   width: 100%;
//   padding-bottom: 140%;
//   position: relative;
//   transform-style: preserve-3d;
//   transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
//   border-radius: 24px;
//   overflow: hidden;
//   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
// }
// 
// .nft-card:hover {
//   transform: rotateY(8deg) rotateX(8deg);
// }
// 
// @keyframes spin-slow {
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }
// 
// .animate-spin-slow {
//   animation: spin-slow 12s linear infinite;
// } 