import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function POST(req: NextRequest) {
  try {
    // Get cookies from the request
    const cookieHeader = req.headers.get('cookie');
    
    // Proxy the request to the backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader || '',
      },
    });

    const data = await backendResponse.json();

    // Create response with the backend data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward cookies from backend to frontend (this will clear them)
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error('Logout proxy error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}