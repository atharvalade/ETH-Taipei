// API endpoint to confirm payment status
import { paymentReferences } from './initiate-payment';

// This would typically verify with the blockchain, but for the hackathon, we'll simulate
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
    const { reference, transaction_id } = req.body;
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Missing reference ID'
      });
    }
    
    // Check if the reference ID exists
    if (!paymentReferences.has(reference)) {
      console.log(`❌ Payment reference not found: ${reference}`);
      return res.status(404).json({
        success: false,
        error: 'Payment reference not found'
      });
    }
    
    // Get the payment details
    const payment = paymentReferences.get(reference);
    
    // In a production environment, we would verify with the World Developer Portal API:
    // GET https://developer.worldcoin.org/api/v2/minikit/transaction/${transaction_id}?app_id=${APP_ID}
    
    // But for the hackathon, we'll simulate a successful payment
    payment.status = 'completed';
    payment.transactionId = transaction_id;
    payment.completedAt = new Date().toISOString();
    
    console.log(`✅ Payment confirmed: ${reference}, Transaction ID: ${transaction_id}`);
    
    return res.status(200).json({
      success: true,
      payment: {
        reference,
        status: payment.status,
        transactionId: transaction_id
      }
    });
  } catch (error) {
    console.error('❌ Error confirming payment:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to confirm payment'
    });
  }
} 