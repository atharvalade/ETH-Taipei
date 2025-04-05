import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to update NFT token ID in the backend
 */
export async function POST(req: NextRequest) {
  try {
    const { walletAddress, hash, nftTokenId } = await req.json();

    if (!walletAddress || !hash || !nftTokenId) {
      return NextResponse.json(
        { error: 'All fields are required: walletAddress, hash, nftTokenId' },
        { status: 400 }
      );
    }

    // Call the backend API to update NFT token ID
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/user/update-nft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        hash,
        nftTokenId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to update NFT token ID' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'NFT token ID updated successfully'
    });
  } catch (error) {
    console.error('Error updating NFT token ID:', error);
    return NextResponse.json(
      { error: 'Failed to update NFT token ID' },
      { status: 500 }
    );
  }
} 