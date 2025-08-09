// file: src/app/api/tickets/public/[orderId]/details/route.ts

import { NextRequest, NextResponse } from 'next/server';

// These should be defined in your .env file
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

// The GET handler for the proxy route
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } =await params;
    console.log(`--- ✅ Public ticket proxy triggered for orderId: ${orderId} ---`);

    if (!backendUrl || !secretKey) {
        console.error("[PROXY] Server configuration error: Backend URL or secret key is missing.");
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // Construct the actual backend endpoint URL
    const fullEndpoint = `${backendUrl}/api/tickets/public/${orderId}/details`;
    console.log(`[PROXY] Forwarding GET request to: ${fullEndpoint}`);

    try {
        // Forward the request to the backend, adding the secret API key for auth
        const backendResponse = await fetch(fullEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': secretKey, // Add your secret key for secure backend communication
            },
            cache: 'no-store', // Ensure data is always fresh
        });
        
        // Get the JSON data from the backend response
        const data = await backendResponse.json();

        // If the backend returned an error, forward that error and status code
        if (!backendResponse.ok) {
            console.error(`[PROXY] Backend returned an error: ${backendResponse.status}`);
            return NextResponse.json({ error: data.error || 'Backend service error' }, { status: backendResponse.status });
        }
        
        // If successful, forward the data and status code from the backend
        return NextResponse.json(data, { status: backendResponse.status });

    } catch (error) {
        console.error("API proxy GET error in /tickets/public/[orderId]/details route:", error);
        return NextResponse.json({ error: 'Failed to connect to the backend service.' }, { status: 502 });
    }
}