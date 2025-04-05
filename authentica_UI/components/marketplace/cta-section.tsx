"use client";

import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-xl">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
            {/* Abstract shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          </div>
          
          <div className="relative z-10 py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-white max-w-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to verify your content?</h2>
              <p className="text-blue-100 text-lg mb-6">
                Join the Authentica platform today and access cutting-edge verification technologies to protect and authenticate your content.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-indigo-700 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                  Get Started
                </button>
                <button className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-all">
                  Learn More
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-shrink-0"
            >
              <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6 border border-white/20 shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-white font-bold text-xl mb-2">
                    Authentica
                  </div>
                  <div className="text-blue-100 text-sm">
                    Verifying AI-Generated Content
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 