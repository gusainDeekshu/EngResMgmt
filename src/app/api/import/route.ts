// src/app/api/import/route.ts
import { NextResponse } from 'next/server';

/**
 * This is a secure API proxy route.
 * It receives a file from the client (browser), adds a secret server-only API key,
 * and forwards the request to the real Express.js backend.
 */
export async function POST(request: Request) {
  // 1. Get the environment variables. The API key is server-side only.
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY; // NO "NEXT_PUBLIC_" prefix!

  if (!backendUrl || !secretKey) {
    console.error("Server Configuration Error: Required environment variables are missing.");
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    // 2. Extract the FormData (which includes the file) from the incoming request.
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file found in the request.' }, { status: 400 });
    }

    // 3. Create a NEW FormData object to send to the Express backend.
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // 4. Construct the full URL for the Express import endpoint.
    // This matches your Express route: router.post('/users/import', ...)
    const fullBackendEndpoint = `${backendUrl}/api/crmroute/users/import`;
    
    console.log(`[Next.js Proxy] Forwarding file import request to: ${fullBackendEndpoint}`);

    // 5. Make the secure server-to-server request.
    const backendResponse = await fetch(fullBackendEndpoint, {
      method: 'POST',
      headers: {
        // Attach the secret key for your Express middleware to validate.
        'x-api-key': secretKey,
      },
      // IMPORTANT: When using FormData with fetch, you DO NOT set the 'Content-Type' header.
      // The browser/fetch API sets it automatically with the correct multipart boundary.
      body: backendFormData,
      cache: 'no-store', // Ensure it's a fresh request every time.
    });

    // 6. Handle the response from the Express backend.
    // First, check if the request was successful.
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`[Next.js Proxy] Error from Express backend: Status ${backendResponse.status}`);
      console.error("[Next.js Proxy] Backend Error Body:", errorText);
      return NextResponse.json(
        { error: `Backend returned status ${backendResponse.status}. See server logs.` },
        { status: backendResponse.status }
      );
    }

    // If successful, parse the JSON report from Express and send it back to the browser.
    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Next.js Proxy] Failed to make server-to-server request:", error);
    return NextResponse.json(
      { error: 'Failed to connect to the backend service. Is the Express server running?' },
      { status: 502 } // 502 Bad Gateway is appropriate here.
    );
  }
}