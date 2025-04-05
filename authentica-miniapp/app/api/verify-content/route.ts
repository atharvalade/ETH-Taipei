import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to verify content using a specific provider
 */
export async function POST(req: NextRequest) {
  try {
    const { providerId, hash, hashKey, walletAddress, chain } = await req.json();

    if (!providerId || !hash || !hashKey || !walletAddress || !chain) {
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
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/detection/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        providerId,
        hash,
        hashKey,
        walletAddress,
        chain
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to verify content' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      result: {
        isHumanWritten: data.isHumanWritten,
        confidenceScore: data.confidenceScore,
        provider: data.provider,
        chain: data.chain,
        hash: data.hash,
        hashKey: data.hashKey
      }
    });
  } catch (error) {
    console.error('Error verifying content:', error);
    return NextResponse.json(
      { error: 'Failed to verify content' },
      { status: 500 }
    );
  }
} 