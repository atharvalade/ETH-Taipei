"use client";
import { useEffect, useState } from "react";

interface NewsCardProps {
  title: string;
  source: string;
  date: string;
  summary: string;
  imageUrl: string;
  delay?: number;
}

export default function NewsCard({ 
  title, 
  source, 
  date, 
  summary, 
  imageUrl,
  delay = 0 
}: NewsCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Safely animate after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Safe function to determine color based on source
  function getSourceColor(sourceName: string): {
    bg: string;
    text: string;
    muted: string;
  } {
    switch(sourceName) {
      case "Nature":
        return {
          bg: "bg-emerald-500",
          text: "text-emerald-500",
          muted: "text-emerald-700"
        };
      case "Reuters":
        return {
          bg: "bg-blue-500",
          text: "text-blue-500",
          muted: "text-blue-700"
        };
      case "The Guardian":
        return {
          bg: "bg-purple-500",
          text: "text-purple-500",
          muted: "text-purple-700"
        };
      default:
        return {
          bg: "bg-indigo-500",
          text: "text-indigo-500",
          muted: "text-indigo-700"
        };
    }
  }
  
  const colors = getSourceColor(source);
  
  return (
    <div 
      className={`
        apple-card bg-white rounded-2xl overflow-hidden clean-shadow
        ${isVisible ? 'opacity-100' : 'opacity-0'} 
        transition-all duration-700 ease-out
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-4 left-4 z-20 flex items-center">
          <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white font-bold text-sm mr-2 shadow-sm`}>
            {source.charAt(0)}
          </div>
          <div>
            <span className="text-sm font-medium text-white">{source}</span>
            <span className="text-xs text-gray-200 ml-2">{date}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>
      </div>
      
      <div className={`h-1 ${colors.bg}`}></div>
    </div>
  );
} 