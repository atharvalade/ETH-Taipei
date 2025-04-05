import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to submit content to the backend for IPFS storage
 * Ultra-simplified to minimize issues
 */
export async function POST(req: NextRequest) {
  try {
    // Get request body
    const requestBody = await req.json();
    const { content, walletAddress } = requestBody;
    
    console.log('[submit-content] Request received:');
    console.log('- Content length:', content ? content.length : 0);
    console.log('- Wallet Address:', walletAddress);

    // Validate required fields
    if (!content || !walletAddress) {
      console.error('[submit-content] Missing required fields');
      return NextResponse.json(
        { error: 'Content and wallet address are required' },
        { status: 400 }
      );
    }

    // Call the backend API directly
    const backendUrl = 'https://ipfs-api1-ethtaipei.vercel.app/api/authentica';
    console.log(`[submit-content] Calling backend API: ${backendUrl}`);
    
    // Forward exactly what we received
    console.log('[submit-content] Sending content to backend API...');
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    console.log(`[submit-content] Backend API response status: ${response.status}`);

    // Get response as text first to debug
    const responseText = await response.text();
    console.log(`[submit-content] Backend API response text: ${responseText}`);
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      console.log('[submit-content] Response parsed successfully');
      
      if (data.success) {
        console.log('[submit-content] Content stored successfully:');
        console.log('- Hash:', data.hash);
        console.log('- HashKey:', data.hashKey);
      }
      
      // Return the API response directly
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error('[submit-content] Failed to parse API response as JSON');
      return NextResponse.json(
        { error: 'Invalid API response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[submit-content] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit content' },
      { status: 500 }
    );
  }
} 