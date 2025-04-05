// API endpoint to update payment status
import { updatePaymentStatus } from '../payment-status';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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
    // Validate authentication - in production, use a proper authentication mechanism
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    const apiKey = authHeader.split(' ')[1];
    if (apiKey !== process.env.HYPERLANE_WEBHOOK_API_KEY) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }
    
    // Extract referenceId and txHash from the request body
    const { referenceId, txHash, status } = req.body;
    
    if (!referenceId || !txHash || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    console.log(`📝 Updating payment status: ${referenceId} -> ${status} (tx: ${txHash})`);
    
    // Update payment status in memory (in production, update in database)
    updatePaymentStatus(referenceId, txHash);
    
    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
} 