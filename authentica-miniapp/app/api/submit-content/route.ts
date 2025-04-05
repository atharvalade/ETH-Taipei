import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to submit content to the backend for IPFS storage
 */
export async function POST(req: NextRequest) {
  try {
    const { content, walletAddress } = await req.json();

    console.log('SUBMIT-CONTENT API ENDPOINT:');
    console.log('- Content length:', content ? content.length : 0);
    console.log('- Wallet Address:', walletAddress);

    if (!content || !walletAddress) {
      console.error('Missing required fields:', { contentProvided: !!content, walletAddressProvided: !!walletAddress });
      return NextResponse.json(
        { error: 'Content and wallet address are required' },
        { status: 400 }
      );
    }

    // Call the backend API to store content in IPFS
    const backendUrl = process.env.BACKEND_API_URL || 'https://ipfs-api1-ethtaipei.vercel.app';
    console.log(`Calling backend API: ${backendUrl}/api/authentica`);

    const requestBody = {
      content,
      walletAddress,
    };
    
    console.log('Request body to backend:', JSON.stringify({
      ...requestBody,
      content: content.substring(0, 50) + (content.length > 50 ? '...' : '') // Truncate content for logging
    }));

    const response = await fetch(`${backendUrl}/api/authentica`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Backend API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to store content' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Content stored successfully!');
    console.log('- Hash:', data.hash);
    console.log('- HashKey:', data.hashKey);

    return NextResponse.json({
      success: true,
      hash: data.hash,
      hashKey: data.hashKey,
    });
  } catch (error) {
    console.error('Error submitting content:', error);
    return NextResponse.json(
      { error: 'Failed to submit content' },
      { status: 500 }
    );
  }
} 