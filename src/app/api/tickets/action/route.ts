// Next.js Project: /app/api/tickets/action/route.ts
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

// This single route handler manages both POST actions (generate, send) and GET actions (download)
export async function POST(request: NextRequest) {
    if (!backendUrl || !secretKey) return NextResponse.json({ error: 'Server config error.' }, { status: 500 });

    const body = await request.json();
    const fullEndpoint = `${backendUrl}/api/tickets/action`;

    try {
        const backendResponse = await fetch(fullEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': secretKey },
            body: JSON.stringify(body),
        });
        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to backend.' }, { status: 502 });
    }
}

export async function GET(request: NextRequest) {
    if (!backendUrl || !secretKey) return NextResponse.json({ error: 'Server config error.' }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const orderId = searchParams.get('orderId');

    if (action !== 'download_ticket' || !orderId) {
        return NextResponse.json({ error: 'Invalid download request.' }, { status: 400 });
    }

    const fullEndpoint = `${backendUrl}/api/tickets/action`;

    try {
        const backendResponse = await fetch(fullEndpoint, {
            method: 'POST', // The backend expects a POST for all actions
            headers: { 'Content-Type': 'application/json', 'x-api-key': secretKey },
            body: JSON.stringify({ action, orderId }),
        });

        // The backend will redirect to S3, so we follow it.
        if (backendResponse.redirected) {
            return NextResponse.redirect(backendResponse.url);
        }

        // If it didn't redirect (e.g., error), return the error.
        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to backend for download.' }, { status: 502 });
    }
}