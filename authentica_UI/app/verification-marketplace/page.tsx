"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FeatureCard from "@/components/marketplace/feature-card";
import NewsCard from "@/components/marketplace/news-card";
import MarketplaceHero from "@/components/marketplace/marketplace-hero";
import ProviderSection from "@/components/marketplace/provider-section";
import HowItWorks from "@/components/marketplace/how-it-works";
import NFTCredential from "@/components/marketplace/nft-credential";
import CtaSection from "@/components/marketplace/cta-section";

export default function VerificationMarketplace() {
  // IMPORTANT: Remove scroll-based animations that hide content
  
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Hero Section - No scrollY-dependent animations that hide content */}
      <div className="relative h-screen flex items-center justify-center">
        <MarketplaceHero />
      </div>
      
      {/* What is Verification Marketplace */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">What is Verification Marketplace?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              title="Verification Algorithms"
              description="Providers list their proprietary algorithms through APIs for verifying AI-generated content"
              icon="/icons/algorithm.svg"
              color="blue"
            />
            <FeatureCard 
              title="Smart Accuracy Score"
              description="Authentica automatically generates an accuracy score based on data set, executing smart contracts to assess the model"
              icon="/icons/accuracy.svg"
              color="purple"
            />
            <FeatureCard 
              title="Crypto Payments"
              description="Payment is processed in crypto to pay for each verification request through Authentica"
              icon="/icons/payment.svg"
              color="orange"
            />
          </div>
        </div>
      </section>
      
      {/* Why is it needed? */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Why is it needed?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <NewsCard 
              title="Rise in Academic Plagiarism"
              source="Nature"
              date="April 2023"
              summary="Universities report a 300% increase in AI-generated academic papers, raising concerns about academic integrity."
              imageUrl="/images/academic.jpg"
            />
            <NewsCard 
              title="Fake News Proliferation"
              source="Reuters"
              date="March 2023"
              summary="AI tools are making it increasingly difficult to distinguish between real and fabricated news, threatening democracy."
              imageUrl="/images/fake-news.jpg"
            />
            <NewsCard 
              title="Content Authenticity Crisis"
              source="The Guardian"
              date="May 2023"
              summary="Creative industries face existential challenge as AI-generated content floods markets without proper attribution."
              imageUrl="/images/content.jpg"
            />
          </div>
        </div>
      </section>
      
      {/* Provider Competition */}
      <ProviderSection />
      
      {/* How it Works */}
      <HowItWorks />
      
      {/* NFT Credentials */}
      <NFTCredential />
      
      {/* Watermarking Solutions */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Watermarking Solutions</h2>
          <p className="text-xl text-center text-gray-700 max-w-3xl mx-auto mb-16">
            Authentica provides watermarking solutions for LLM hosting companies, with 99.9% accuracy within 100 tokens.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500">
              <h3 className="text-2xl font-bold mb-4">Regulatory Compliance</h3>
              <p className="text-gray-700">
                Provide solutions for companies wanting to comply with regulations - soon companies will need verification systems to combat fake content.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500">
              <h3 className="text-2xl font-bold mb-4">API Integration</h3>
              <p className="text-gray-700">
                Through Authentica APIs, we provide watermarking solutions for companies like OpenAI who can send LLM responses for watermarking based on research.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <CtaSection />
    </div>
  );
} 