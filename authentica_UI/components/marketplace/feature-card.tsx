"use client";
import { useEffect, useState } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color?: "blue" | "purple" | "orange" | "green";
  delay?: number;
}

export default function FeatureCard({ 
  title, 
  description, 
  icon, 
  color = "blue",
  delay = 0
}: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Safely animate after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const colorClasses = {
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-600",
      light: "bg-blue-50"
    },
    purple: {
      bg: "bg-purple-600",
      text: "text-purple-600",
      light: "bg-purple-50"
    },
    orange: {
      bg: "bg-orange-500",
      text: "text-orange-500",
      light: "bg-orange-50"
    },
    green: {
      bg: "bg-emerald-600",
      text: "text-emerald-600",
      light: "bg-emerald-50"
    },
  };

  return (
    <div 
      className={`
        apple-card bg-white rounded-2xl overflow-hidden clean-shadow
        ${isVisible ? 'opacity-100' : 'opacity-0'} 
        transition-all duration-700 ease-out
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="p-8">
        <div className={`w-16 h-16 mb-6 rounded-full ${colorClasses[color].light} flex items-center justify-center`}>
          <svg className={`w-8 h-8 ${colorClasses[color].text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className={`h-1.5 ${colorClasses[color].bg}`}></div>
    </div>
  );
} 