// file: src/app/api/orders/[[...action]]/route.ts (SIMPLIFIED)

import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

// This file now ONLY handles GET requests for fetching orders.
export async function GET(request: NextRequest) {
  if (!backendUrl || !secretKey) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const fullEndpoint = `${backendUrl}/api/orders?${searchParams.toString()}`;
  
  try {
    const backendResponse = await fetch(fullEndpoint, {
      method: 'GET',
      headers: { 'x-api-key': secretKey },
      cache: 'no-store', 
    });

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
        return NextResponse.json({ error: data.error || 'Backend error' }, { status: backendResponse.status });
    }
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("API proxy GET error:", error);
    return NextResponse.json({ error: 'Failed to connect to the backend service.' }, { status: 502 });
  }
}

// The POST handler has been completely removed from this file.