import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to verify content using a specific provider
 */
export async function POST(req: NextRequest) {
  try {
    const { providerId, hash, hashKey, walletAddress, chain } = await req.json();

    // Add detailed logging
    console.log('VERIFY-CONTENT API ENDPOINT:');
    console.log('Request parameters:');
    console.log('- Provider ID:', providerId);
    console.log('- Hash:', hash);
    console.log('- HashKey:', hashKey);
    console.log('- HashKey length:', hashKey ? hashKey.length : 0);
    console.log('- Wallet Address:', walletAddress);
    console.log('- Chain:', chain);

    if (!providerId || !hash || !hashKey || !walletAddress || !chain) {
      console.error('Missing required fields:', { providerId, hash, hashKey, walletAddress, chain });
      return NextResponse.json(
        { error: 'All fields are required: providerId, hash, hashKey, walletAddress, chain' },
        { status: 400 }
      );
    }

    // Validate chain value
    if (chain !== 'WORLD' && chain !== 'ROOTSTOCK') {
      return NextResponse.json(
        { error: 'Invalid chain value. Must be WORLD or ROOTSTOCK' },
        { status: 400 }
      );
    }

    // Call the backend API to verify content
    const backendUrl = process.env.BACKEND_API_URL || 'https://ipfs-api1-ethtaipei.vercel.app';
    console.log(`Calling backend API: ${backendUrl}/api/authentica`);
    
    const requestBody = {
      action: 'verify',
      providerId,
      hash,
      hashKey, // Using the original hashKey as-is
      walletAddress,
      chain
    };

    console.log('Request body to backend:', JSON.stringify(requestBody));
    
    const response = await fetch(`${backendUrl}/api/authentica`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Backend API response status:', response.status);
    const responseText = await response.text();
    console.log('Backend API response text:', responseText);
    
    try {
      // Try to parse as JSON
      const data = JSON.parse(responseText);
      console.log('Response parsed successfully');
      
      if (!response.ok) {
        console.error('API error:', data);
        return NextResponse.json(
          { error: data.error || 'Failed to verify content' },
          { status: response.status }
        );
      }
      
      console.log('Verification successful');
      return NextResponse.json({
        success: true,
        result: data.result
      });
    } catch (jsonError) {
      console.error('Failed to parse API response as JSON:', responseText);
      return NextResponse.json(
        { error: 'Invalid API response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error verifying content:', error);
    return NextResponse.json(
      { error: 'Failed to verify content' },
      { status: 500 }
    );
  }
} 