// API endpoint to handle Hyperlane payment events from the World Chain contract
import crypto from 'crypto';

// In a real implementation, you would use a database instead of in-memory storage
const verifiedPayments = new Map();

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
    
    // Parse and validate the event data
    const { 
      event,
      transactionHash,
      blockNumber,
      args
    } = req.body;
    
    if (!event || !transactionHash || !blockNumber || !args) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event data'
      });
    }
    
    console.log(`📥 Received ${event} event from transaction ${transactionHash}`);
    
    // Handle different event types
    if (event === 'PaymentVerified') {
      const { paymentId, userAddress, amount, timestamp } = args;
      
      console.log(`✅ Payment verified for user ${userAddress}, amount: ${amount}, at: ${timestamp}`);
      
      // Store the payment in the verifiedPayments map
      verifiedPayments.set(paymentId, {
        paymentId,
        userAddress,
        amount,
        timestamp,
        verifiedAt: Date.now()
      });
      
      // In a production app, you would:
      // 1. Store the payment verification in a database
      // 2. Trigger the verification service
      // 3. Update the user's profile with the verification result
      
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId
      });
    } 
    else if (event === 'ServiceExecuted') {
      const { paymentId, userAddress } = args;
      
      console.log(`✅ Service executed for user ${userAddress}, paymentId: ${paymentId}`);
      
      // In a production app, you would:
      // 1. Mark the service as executed in the database
      // 2. Notify the user that their service has been executed
      
      return res.status(200).json({
        success: true,
        message: 'Service executed successfully',
        paymentId
      });
    }
    else {
      console.warn(`⚠️ Unhandled event type: ${event}`);
      
      return res.status(400).json({
        success: false,
        error: 'Unhandled event type'
      });
    }
  } catch (error) {
    console.error('❌ Error processing Hyperlane webhook:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// Get payment verification status by ID
export function getPaymentVerification(paymentId) {
  return verifiedPayments.get(paymentId) || null;
} 