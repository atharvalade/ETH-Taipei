"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
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
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our streamlined verification process leverages blockchain technology for secure, transparent content verification.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 relative z-10"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl mb-6 mx-auto">
                  {step.icon}
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-4 border-indigo-500 z-20 hidden md:flex items-center justify-center text-lg font-bold text-indigo-500">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-center mb-3">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 