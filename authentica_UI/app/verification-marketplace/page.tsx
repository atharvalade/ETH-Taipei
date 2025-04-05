"use client";

import React, { useEffect, useState } from "react";
import FeatureCard from "../../components/marketplace/feature-card";
import NewsCard from "../../components/marketplace/news-card";
import MarketplaceHero from "../../components/marketplace/marketplace-hero";
import ProviderSection from "../../components/marketplace/provider-section";
import HowItWorks from "../../components/marketplace/how-it-works";
import NFTCredential from "../../components/marketplace/nft-credential";
import CtaSection from "../../components/marketplace/cta-section";
import ScrollToTop from "../../components/marketplace/scroll-to-top";
import { useInView } from 'react-intersection-observer';

export default function VerificationMarketplace() {
  // This will contain visibility states for different sections
  const [sectionsReady, setSectionsReady] = useState(false);
  
  useEffect(() => {
    // Wait until page has loaded before triggering animations
    const timer = setTimeout(() => {
      setSectionsReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Sections that will animate when they come into view
  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: newsRef, inView: newsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: providersRef, inView: providersInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <MarketplaceHero />
      </section>
      
      {/* What is Verification Marketplace - Apple-style grid */}
      <section ref={featuresRef} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className={`
            text-center mb-12
            ${sectionsReady && featuresInView ? 'animate-smooth-appear' : 'opacity-0'}
          `}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What is Verification Marketplace?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects content creators with powerful verification services to authenticate AI-generated content
            </p>
          </div>
          
          {/* Apple-style grid layout */}
          <div className={`
            grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-5
            ${sectionsReady && featuresInView ? 'animate-smooth-appear animate-delay-200' : 'opacity-0'}
          `}>
            {/* Large feature - Verification Algorithms */}
            <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl overflow-hidden p-8 text-white apple-card">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Verification Algorithms</h3>
                  <p className="text-lg text-blue-50">
                    Providers list their proprietary algorithms through APIs for verifying AI-generated content. Our marketplace creates healthy competition between providers.
                  </p>
                </div>
                <div className="mt-8">
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/20 transition-all">
                    Learn more →
                  </button>
                </div>
              </div>
            </div>
            
            {/* Smart Accuracy Score */}
            <div className="md:col-span-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl overflow-hidden p-6 text-white apple-card">
              <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Accuracy Score</h3>
              <p className="text-sm text-purple-50">
                Authentica automatically generates an accuracy score based on data set, executing smart contracts to assess the model
              </p>
            </div>
            
            {/* Crypto Payments */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl overflow-hidden p-6 text-white apple-card">
              <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Crypto Payments</h3>
              <p className="text-sm text-orange-50">
                Payment is processed in crypto to pay for each verification request through Authentica
              </p>
            </div>
            
            {/* NFT Credentials */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl overflow-hidden p-6 text-white apple-card">
              <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">NFT Credentials</h3>
              <p className="text-sm text-emerald-50">
                Mint an NFT credential as proof of authenticity for human-created content
              </p>
            </div>
            
            {/* Cross-chain Technology */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden p-6 text-white apple-card">
              <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-3">Cross-chain Technology</h3>
                  <p className="text-sm text-gray-300">
                    Powered by World App, Metal, and Rootstock for secure, transparent content verification
                  </p>
                </div>
                <div className="flex gap-2 ml-auto">
                  <div className="w-10 h-10 bg-white rounded-full"></div>
                  <div className="w-10 h-10 bg-white rounded-full"></div>
                  <div className="w-10 h-10 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why is it needed? */}
      <section ref={newsRef} className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className={`
            text-center mb-16 
            ${sectionsReady && newsInView ? 'animate-smooth-appear' : 'opacity-0'}
          `}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why is it needed?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As AI-generated content becomes indistinguishable from human creations, verification tools are essential
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NewsCard 
              title="Rise in Academic Plagiarism"
              source="Nature"
              date="April 2023"
              summary="Universities report a 300% increase in AI-generated academic papers, raising concerns about academic integrity."
              imageUrl="/images/academic.jpg"
              delay={100}
            />
            <NewsCard 
              title="Fake News Proliferation"
              source="Reuters"
              date="March 2023"
              summary="AI tools are making it increasingly difficult to distinguish between real and fabricated news, threatening democracy."
              imageUrl="/images/fake-news.jpg"
              delay={200}
            />
            <NewsCard 
              title="Content Authenticity Crisis"
              source="The Guardian"
              date="May 2023"
              summary="Creative industries face existential challenge as AI-generated content floods markets without proper attribution."
              imageUrl="/images/content.jpg"
              delay={300}
            />
          </div>
        </div>
      </section>
      
      {/* Provider Competition */}
      <section ref={providersRef} className="py-16 md:py-24 bg-gray-50">
        <div className={`
          container mx-auto px-4 max-w-6xl
          ${sectionsReady && providersInView ? 'animate-smooth-appear' : 'opacity-0'}
        `}>
          <ProviderSection />
        </div>
      </section>
      
      {/* How it Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <HowItWorks />
        </div>
      </section>
      
      {/* NFT Credentials */}
      <section className="py-16 md:py-24 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <NFTCredential />
        </div>
      </section>
      
      {/* Watermarking Solutions */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Watermarking Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Authentica provides watermarking solutions for LLM hosting companies, with 99.9% accuracy within 100 tokens.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="apple-card bg-white rounded-2xl p-8 clean-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Regulatory Compliance</h3>
              <p className="text-gray-600">
                Provide solutions for companies wanting to comply with regulations - soon companies will need verification systems to combat fake content.
              </p>
            </div>
            <div className="apple-card bg-white rounded-2xl p-8 clean-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">API Integration</h3>
              <p className="text-gray-600">
                Through Authentica APIs, we provide watermarking solutions for companies like OpenAI who can send LLM responses for watermarking based on research.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <CtaSection />
        </div>
      </section>
      
      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
} 