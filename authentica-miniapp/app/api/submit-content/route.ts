import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to submit content to the backend for IPFS storage
 */
export async function POST(req: NextRequest) {
  try {
    const { content, walletAddress } = await req.json();

    if (!content || !walletAddress) {
      return NextResponse.json(
        { error: 'Content and wallet address are required' },
        { status: 400 }
      );
    }

    // Call the backend API to store content in IPFS
    const backendUrl = process.env.BACKEND_API_URL || 'https://ipfs-api1-ethtaipei.vercel.app';
    const response = await fetch(`${backendUrl}/api/authentica`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        walletAddress,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to store content' },
        { status: response.status }
      );
    }

    const data = await response.json();

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