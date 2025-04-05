"use client";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export default function NFTCredential() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
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
  
  // Auto rotate through example NFT cards
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  // Example NFT cards data
  const nftCards = [
    {
      id: "a728f9",
      title: "Article Verification",
      score: "98.7%", 
      date: "June 12, 2023",
      address: "0x71C...8F3D",
      gradient: "from-indigo-600 via-indigo-800 to-purple-800"
    },
    {
      id: "b495e2",
      title: "Video Authenticity",
      score: "99.2%", 
      date: "July 03, 2023",
      address: "0x43D...9A2B",
      gradient: "from-emerald-600 via-emerald-800 to-blue-800"
    },
    {
      id: "c371d4",
      title: "Art Certificate",
      score: "97.8%", 
      date: "May 28, 2023",
      address: "0x89F...2C5E",
      gradient: "from-rose-600 via-rose-800 to-orange-800"
    }
  ];

  return (
    <div ref={ref} className="relative z-10 max-w-6xl mx-auto text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">NFT Credentials for Human Creation</h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Protect your authentic human-created content with blockchain-backed NFT credentials
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Left Side - NFT Cards Display */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-lg perspective-card">
              {/* NFT Carousel */}
              <div className="relative h-[400px] w-full">
                {nftCards.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    className={`absolute inset-0 ${idx === activeCard ? 'z-10' : 'z-0'}`}
                    initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                    animate={idx === activeCard 
                      ? { opacity: 1, scale: 1, rotateY: 0 } 
                      : { opacity: 0, scale: 0.9, rotateY: 10 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* 3D NFT Card with improved aspect ratio */}
                    <div className="relative nft-card aspect-[3/2] w-full shadow-2xl rounded-2xl overflow-hidden animate-subtle-glow">
                      {/* Card background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl overflow-hidden`}>
                        <div className="absolute inset-0 bg-[url('/images/nft-pattern.svg')] opacity-20"></div>
                      </div>
                      
                      {/* Card content */}
                      <div className="relative p-6 h-full flex flex-col">
                        {/* Card header */}
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
                            <div className="text-xs font-mono text-indigo-100">#{card.id}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-1 items-center">
                          <div className="grid grid-cols-3 gap-4 w-full">
                            {/* Left column - Hologram */}
                            <div className="col-span-1 flex justify-center items-center">
                              <div className="relative w-24 h-24">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 animate-spin-slow blur-sm"></div>
                                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Middle and right columns - Title and details */}
                            <div className="col-span-2">
                              <h3 className="text-xl font-bold mb-2 text-white">{card.title}</h3>
                              <div className="text-sm text-indigo-200 font-medium mb-4">Human Creation Verified</div>
                              
                              {/* Certificate details */}
                              <div className="grid grid-cols-2 gap-2 text-center mb-3">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                                  <div className="text-xs text-indigo-200 mb-1">Confidence</div>
                                  <div className="text-base font-bold text-white">{card.score}</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                                  <div className="text-xs text-indigo-200 mb-1">Issued</div>
                                  <div className="text-xs font-bold text-white">{card.date}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Certificate footer */}
                        <div className="w-full flex items-center justify-between text-indigo-200 text-xs mt-4">
                          <div>blockchain.authentica.io</div>
                          <div className="font-mono">{card.address}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Carousel indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {nftCards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCard(idx)}
                    className={`w-2 h-2 rounded-full transition-all 
                      ${idx === activeCard ? 'bg-white w-6' : 'bg-white/30'}`}
                    aria-label={`View NFT example ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Right Side - Benefits text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-6"
          >
            <h3 className="text-2xl font-bold mb-6 md:text-left text-center">Benefits of NFT Credentials</h3>
            <p className="text-indigo-100 mb-8 md:text-left text-center">
              When human-created content is verified with a confidence score above 95%, 
              creators can mint an NFT credential as proof of authenticity.
            </p>
            <div className="space-y-6 mb-10">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                  title: "Verifiable Proof of Human Creation",
                  description: "Blockchain-based verification provides indisputable evidence that your content was created by a human, not AI."
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
                  title: "Protect Intellectual Property",
                  description: "Establish clear ownership and provenance for your creative works, preventing unauthorized AI-generated replicas."
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
                  title: "Seamless Sharing & Embedding",
                  description: "Easily share your verification credentials across platforms or embed them directly into your website or portfolio."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.15) }}
                  className="flex items-start gap-4 group"
                >
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      {item.icon}
                    </svg>
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                    <p className="text-indigo-100 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-full bg-white text-indigo-900 px-6 py-3 font-medium shadow-lg"
              >
                Mint Your NFT
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="rounded-full bg-indigo-600/30 backdrop-blur-sm text-white px-6 py-3 font-medium border border-indigo-400/30"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
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
//   transform-style: preserve-3d;
//   transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
// }
// 
// .nft-card:hover {
//   transform: rotateY(8deg) rotateX(5deg);
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