"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function NFTCredential() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Apple-like parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.2, 0.6], [0.8, 1]);

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 bg-gradient-to-br from-blue-900 to-indigo-900 text-white overflow-hidden relative"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              style={{ opacity, y }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">NFT Credentials for Human Creation</h2>
              <p className="text-xl text-blue-100">
                When human-created content is verified with a confidence score above 95%, 
                creators can mint an NFT credential as proof of authenticity.
              </p>
              <ul className="space-y-4 text-blue-100">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Verifiable proof of human creation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Blockchain-backed authenticity</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Easy sharing and embedding options</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Protect your intellectual property</span>
                </li>
              </ul>
              <button className="mt-8 bg-white text-indigo-900 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                Learn More
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            style={{ scale }}
            className="relative"
          >
            <div className="relative z-10 bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-indigo-300/20 p-2">
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-400 to-blue-600 aspect-square w-full relative flex items-center justify-center">
                  {/* Placeholder for NFT credential mockup */}
                  <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-xs mb-2 text-blue-100">NFT CREDENTIAL #A728F9</div>
                      <div className="text-2xl font-bold mb-1">Verified Human Creation</div>
                      <div className="text-sm text-blue-200">Confidence Score: 98.7%</div>
                      <div className="mt-4 h-40 w-40 mx-auto rounded-lg bg-blue-400/20 flex items-center justify-center">
                        <svg className="w-20 h-20 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600/20 rounded-full blur-3xl"></div>
    </section>
  );
} 