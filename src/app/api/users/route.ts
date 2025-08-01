// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Read backend URL and secret key from environment variables for security
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

  if (!backendUrl || !secretKey) {
    console.error("Server config error: Backend URL or API Key is missing.");
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  // Get search params from the original request (e.g., ?page=1&search=test)
  const { searchParams } = new URL(request.url);

  // The final endpoint of your Node.js server
  const fullEndpoint = `${backendUrl}/api/crmroute/userdata?${searchParams.toString()}`;
  console.log(`Proxying request to: ${fullEndpoint}`);

  try {
    const backendResponse = await fetch(fullEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey, // Add the secret key for backend authentication
      },
      // Important for dynamic data: prevent Next.js from caching the response
      cache: 'no-store', 
    });

    // Handle non-OK responses from the backend
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Error from backend API: Status ${backendResponse.status}`, errorText);
      return NextResponse.json(
        { error: `Error from backend: ${backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }

    // If successful, parse the JSON and return it to the frontend
    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Failed to make server-to-server request:", error);
    return NextResponse.json({ error: 'Failed to connect to the backend service.' }, { status: 502 }); // 502 Bad Gateway
  }
}