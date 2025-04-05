"use client";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">NFT Credentials for Human Creation</h2>
          <p className="text-lg text-indigo-100 max-w-3xl mx-auto">
            Protect your authentic human-created content with blockchain-backed NFT credentials
          </p>
        </motion.div>
        
        <div className="flex justify-center">
          {/* Benefits section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h3 className="text-xl font-bold mb-3 text-center md:text-left">Benefits of NFT Credentials</h3>
            <p className="text-indigo-100 mb-4 text-center md:text-left">
              When human-created content is verified with a confidence score above 95%, 
              creators can mint an NFT credential as proof of authenticity.
            </p>
            <div className="space-y-4 mb-6">
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
                  className="flex items-start gap-3 group"
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