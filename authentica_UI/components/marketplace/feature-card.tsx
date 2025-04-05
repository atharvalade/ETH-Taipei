"use client";

import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color?: "blue" | "purple" | "orange" | "green";
}

export default function FeatureCard({ title, description, icon, color = "blue" }: FeatureCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      <div className={`h-2 bg-gradient-to-r ${colorClasses[color]}`}></div>
      <div className="p-8">
        <div className="w-16 h-16 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          {/* Placeholder for icon - would use actual SVG in production */}
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </motion.div>
  );
} 