// API endpoint to initiate a payment transaction
import crypto from 'crypto';

// In-memory storage for tracking payment references
const paymentReferences = new Map();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Generate a unique reference ID without dashes
    const referenceId = crypto.randomUUID().replace(/-/g, '');
    
    // Get wallet address if provided
    const { walletAddress } = req.body || {};
    
    // Store the reference ID with timestamp and status
    paymentReferences.set(referenceId, {
      timestamp: new Date().toISOString(),
      status: 'pending',
      walletAddress,
    });
    
    console.log(`🔄 Payment initiated with reference ID: ${referenceId}`);
    
    return res.status(200).json({
      success: true,
      id: referenceId
    });
  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate payment'
    });
  }
}

// Export the references map for verification
export { paymentReferences }; 