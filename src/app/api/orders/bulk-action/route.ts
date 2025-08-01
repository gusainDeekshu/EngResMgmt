// file: src/app/api/orders/bulk-action/route.ts  (NEW FILE)

import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

export async function POST(request: NextRequest) {
    console.log("--- ✅ Correct `bulk-action` route handler was triggered. ---");

    if (!backendUrl || !secretKey) {
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const body = await request.json();

    // The URL is now hardcoded and guaranteed to be correct.
    const fullEndpoint = `${backendUrl}/api/orders/bulk-action`;
    console.log(`[PROXY] Forwarding POST request to: ${fullEndpoint}`);

    try {
        const backendResponse = await fetch(fullEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': secretKey,
            },
            body: JSON.stringify(body),
        });
        
        if (backendResponse.headers.get('Content-Type')?.includes('application/pdf')) {
            const blob = await backendResponse.blob();
            const headers = new Headers();
            headers.set('Content-Type', 'application/pdf');
            headers.set('Content-Disposition', backendResponse.headers.get('Content-Disposition') || 'attachment');
            return new NextResponse(blob, { status: 200, headers });
        }
        
        const data = await backendResponse.json();
        if (!backendResponse.ok) {
            return NextResponse.json({ error: data.error || 'Backend error' }, { status: backendResponse.status });
        }
        return NextResponse.json(data);

    } catch (error) {
        console.error("API proxy POST error in /bulk-action route:", error);
        return NextResponse.json({ error: 'Failed to connect to the backend service.' }, { status: 502 });
    }
}