// API route for submitting content
// This forwards to the deployed API server

import { NextResponse } from 'next/server';

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_VERCEL_API_URL || 'http://localhost:3000/api/authentica';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting content:', error);
    return NextResponse.json(
      { error: 'Failed to submit content to API', details: error.message },
      { status: 500 }
    );
  }
} 