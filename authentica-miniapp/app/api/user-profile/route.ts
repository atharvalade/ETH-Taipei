import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to fetch user profile data from the backend
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const walletAddress = url.searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Call the backend API to get user profile data
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/user/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch user profile' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      profile: {
        walletAddress: data.walletAddress,
        username: data.username,
        isWorldIdVerified: data.isWorldIdVerified,
        verificationCount: data.verificationCount,
        transactions: data.transactions || []
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 