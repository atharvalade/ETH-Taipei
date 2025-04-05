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
      
      {/* What is Verification Marketplace */}
      <section ref={featuresRef} className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className={`
            text-center mb-16 
            ${sectionsReady && featuresInView ? 'animate-smooth-appear' : 'opacity-0'}
          `}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What is Verification Marketplace?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects content creators with powerful verification services to authenticate AI-generated content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Verification Algorithms"
              description="Providers list their proprietary algorithms through APIs for verifying AI-generated content"
              icon="/icons/algorithm.svg"
              color="blue"
              delay={100}
            />
            <FeatureCard 
              title="Smart Accuracy Score"
              description="Authentica automatically generates an accuracy score based on data set, executing smart contracts to assess the model"
              icon="/icons/accuracy.svg"
              color="purple"
              delay={200}
            />
            <FeatureCard 
              title="Crypto Payments"
              description="Payment is processed in crypto to pay for each verification request through Authentica"
              icon="/icons/payment.svg"
              color="orange"
              delay={300}
            />
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