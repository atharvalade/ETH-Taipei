// API proxy route for the frontend app
// This routes API requests to the deployed API server

import { NextResponse } from 'next/server';

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_VERCEL_API_URL || 'https://ipfs-api1-ethtaipei.vercel.app/api/authentica';

export async function GET(request) {
  // Forward the search params
  const url = new URL(request.url);
  const queryParams = url.search;
  
  try {
    const response = await fetch(`${API_URL}${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying GET request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API' },
      { status: 500 }
    );
  }
}

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
    console.error('Error proxying POST request:', error);
    return NextResponse.json(
      { error: 'Failed to send data to API' },
      { status: 500 }
    );
  }
} 