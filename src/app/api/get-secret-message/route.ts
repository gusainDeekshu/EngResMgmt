// src/app/api/get-secret-message/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

  if (!backendUrl || !secretKey) {
    console.error("Server configuration error: BACKEND_API_BASE_URL or INTERNAL_API_KEY is missing.");
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  // The final endpoint of your Node.js server
  const fullEndpoint = `${backendUrl}/api/crmroute/userdata`;

  // --- DEBUGGING LINE ---
  console.log(`Next.js is attempting to call backend at: ${fullEndpoint}`);

  try {
    const backendResponse = await fetch(fullEndpoint, {
      method: 'GET',
      headers: {
        'x-api-key': secretKey,
      },
      cache: 'no-store',
    });

    // --- ENHANCED ERROR HANDLING ---
    // Check if the response is NOT okay (e.g., 404, 401, 500)
    if (!backendResponse.ok) {
      // Get the raw text of the error response to see the HTML
      const errorText = await backendResponse.text();
      console.error(`Error from backend: Status ${backendResponse.status}`);
      console.error("Backend Response Body:", errorText); // This will show you the HTML
      
      return NextResponse.json(
        { error: `Backend returned status ${backendResponse.status}. Check Next.js server logs.` },
        { status: backendResponse.status }
      );
    }

    // If we get here, the response is OK. Now we can safely parse it.
    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Failed to make server-to-server request:", error);
    return NextResponse.json({ error: 'Failed to connect to backend service. Is it running?' }, { status: 502 });
  }
}