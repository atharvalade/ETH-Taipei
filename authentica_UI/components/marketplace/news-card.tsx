"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface NewsCardProps {
  title: string;
  source: string;
  date: string;
  summary: string;
  imageUrl: string;
}

export default function NewsCard({ title, source, date, summary, imageUrl }: NewsCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
    >
      <div className="relative h-48 w-full">
        {/* Use placeholder image since we don't have actual images */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-medium">
          {source}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">{source}</span>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-700">{summary}</p>
      </div>
    </motion.div>
  );
} 