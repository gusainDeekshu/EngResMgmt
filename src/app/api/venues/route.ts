// app/api/venues/route.ts
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

export async function GET(request: NextRequest) {
    if (!backendUrl || !secretKey) {
        console.error("Server configuration error: Backend URL or API key is missing.");
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // The new, clean endpoint on your Node.js backend
    const fullEndpoint = `${backendUrl}/api/venues`;

    try {
        const backendResponse = await fetch(fullEndpoint, {
            method: 'GET',
            headers: {
                'x-api-key': secretKey, // Use the internal API key for server-to-server auth
                'Content-Type': 'application/json'
            },
            cache: 'no-store', // Ensures fresh data is fetched every time
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            // Forward any errors from the backend to the client
            return NextResponse.json({ error: data.message || 'Failed to fetch venues.' }, { status: backendResponse.status });
        }

        // Forward the successful response to the client
        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error("Failed to connect to backend:", error);
        return NextResponse.json({ error: 'Failed to connect to backend.', details: error.message }, { status: 502 });
    }
}