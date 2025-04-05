// API endpoint to check Rootstock payment status
import { ethers } from 'ethers';

// In-memory store of transactions (in production, use a database)
const paymentStatus = new Map();

// In production, this might be fetched from a database or blockchain
export function updatePaymentStatus(referenceId, txHash) {
  paymentStatus.set(referenceId, {
    status: 'completed',
    txHash,
    timestamp: Date.now()
  });
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Get reference ID from query
    const { referenceId } = req.query;
    
    if (!referenceId) {
      return res.status(400).json({
        success: false,
        error: 'Reference ID is required'
      });
    }
    
    console.log(`🔍 Checking payment status for reference: ${referenceId}`);
    
    // Check if we have stored status for this reference ID
    const storedStatus = paymentStatus.get(referenceId);
    
    if (storedStatus) {
      console.log(`✅ Found stored status: ${JSON.stringify(storedStatus)}`);
      return res.status(200).json({
        success: true,
        ...storedStatus
      });
    }
    
    // In production, this would check the blockchain for confirmed transactions
    // This is a simplified version that just returns 'pending'
    
    console.log(`⏳ No stored status found, returning pending`);
    return res.status(200).json({
      success: true,
      status: 'pending',
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('❌ Error checking payment status:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error checking payment status'
    });
  }
} 