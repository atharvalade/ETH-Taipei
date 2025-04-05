import { NextRequest, NextResponse } from "next/server";

// In a real app, this would fetch data from a database
// For this demo, we'll generate data based on the wallet address

// Helper function to create deterministic data from a wallet address
function createUserDataFromWallet(walletAddress: string) {
  const hashCode = simpleHash(walletAddress);
  
  // Generate a deterministic verification count (1-15)
  const verificationCount = 1 + (hashCode % 14);
  
  // Generate mock NFT certificates based on wallet
  const certificateCount = Math.min(3, (hashCode % 5)); // 0-4 certificates
  const certificates = [];
  
  const providers = ["RealText Systems", "VerifyAI Labs", "TrueContent", "AI Detector Pro", "HumanOrNot"];
  const chains = ["WORLD", "ROOTSTOCK", "ETHEREUM"];
  
  for (let i = 0; i < certificateCount; i++) {
    const dateOffset = (hashCode % 90) + (i * 20); // 0-90 days ago, spaced out
    const date = new Date();
    date.setDate(date.getDate() - dateOffset);
    
    certificates.push({
      id: `AUTH-${(hashCode % 900000) + 100000 + (i * 111)}`,
      date: date.toISOString().split('T')[0],
      provider: providers[(hashCode + i) % providers.length],
      chain: chains[(hashCode + i) % chains.length],
    });
  }
  
  return {
    verificationCount,
    certificates,
    isVerified: (hashCode % 3 === 0), // ~33% chance of being verified
  };
}

// Simple hash function for deterministic values
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get('walletAddress');
  
  if (!walletAddress) {
    return NextResponse.json({ 
      error: "Wallet address is required" 
    }, { status: 400 });
  }
  
  // Generate user data based on wallet address
  const userData = createUserDataFromWallet(walletAddress);
  
  return NextResponse.json({
    walletAddress,
    ...userData
  });
} 