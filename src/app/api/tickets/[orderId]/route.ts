// app/api/tickets/[orderId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

/**
 * This route acts as a secure proxy for an admin to download any ticket PDF.
 * It adds the internal API key to the request before forwarding it to the backend.
 */
export async function GET(
    request: NextRequest,
    
    { params }: { params: Promise<{ orderId: string }> }
) {
    if (!backendUrl || !secretKey) {
        console.error("Server configuration error: Backend URL or API key is missing.");
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const { orderId } = await params;
    if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
    }

    // Call the new admin-specific backend endpoint
    const fullBackendUrl = `${backendUrl}/api/tickets/admin/${orderId}/download`;

    try {
        const backendResponse = await fetch(fullBackendUrl, {
            method: 'GET',
            headers: {
                // Use the secret API key for authentication, not a user token
                'x-api-key': secretKey,
            },
        });

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            console.error("Backend returned an error:", errorData);
            return NextResponse.json(
                { error: errorData.message || 'Failed to fetch ticket from backend.' },
                { status: backendResponse.status }
            );
        }

        // The backend responds with the PDF file. Stream it back to the client.
        const pdfBlob = await backendResponse.blob();

        return new NextResponse(pdfBlob, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="ticket-${orderId}.pdf"`,
            },
        });

    } catch (error: any) {
        console.error("Proxy error while fetching ticket PDF:", error);
        return NextResponse.json({ error: 'Failed to connect to backend service.' }, { status: 502 });
    }
}