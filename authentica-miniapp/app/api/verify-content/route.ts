import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to verify content using a specific provider
 * Ultra-simplified to minimize issues
 */
export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const requestBody = await req.json();
    console.log('[verify-content] Request body:', JSON.stringify(requestBody, null, 2));
    
    const { providerId, hash, hashKey, walletAddress, chain } = requestBody;

    // Validate required fields
    if (!providerId || !hash || !hashKey || !walletAddress || !chain) {
      console.error('[verify-content] Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required: providerId, hash, hashKey, walletAddress, chain' },
        { status: 400 }
      );
    }

    // FIX: Try to decode hashKey if it's URL encoded
    // This helps when hashKey comes from URL parameters and might be encoded
    let decodedHashKey = hashKey;
    try {
      // First check if it appears to be encoded (contains % characters)
      if (hashKey.includes('%')) {
        console.log('[verify-content] HashKey appears to be URL encoded, attempting to decode');
        decodedHashKey = decodeURIComponent(hashKey);
        console.log('[verify-content] Original hashKey:', hashKey);
        console.log('[verify-content] Decoded hashKey:', decodedHashKey);
      }
    } catch (decodeError) {
      console.error('[verify-content] Error decoding hashKey, using original value:', decodeError);
      decodedHashKey = hashKey; // Fallback to original if decoding fails
    }

    // Call the backend API directly
    const backendUrl = 'https://ipfs-api1-ethtaipei.vercel.app/api/authentica';
    console.log(`[verify-content] Calling backend API: ${backendUrl}`);
    
    // Forward the parameters using the decoded hashKey 
    const backendRequestBody = {
      action: 'verify',
      providerId,
      hash,
      hashKey: decodedHashKey, // Use decoded hashKey here
      walletAddress,
      chain
    };
    
    console.log('[verify-content] Backend request body:', JSON.stringify(backendRequestBody, null, 2));
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendRequestBody)
    });
    
    console.log(`[verify-content] Backend API response status: ${response.status}`);
    
    // Get response as text first to debug
    const responseText = await response.text();
    console.log(`[verify-content] Backend API response text: ${responseText}`);
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      console.log('[verify-content] Response parsed successfully');
      
      // Return the API response directly
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error('[verify-content] Failed to parse API response as JSON');
      return NextResponse.json(
        { error: 'Invalid API response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[verify-content] Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify content' },
      { status: 500 }
    );
  }
} 