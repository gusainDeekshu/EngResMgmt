// src/app/api/sse/route.ts

/**
 * This is a secure API proxy route for Server-Sent Events (SSE).
 * The browser connects to THIS endpoint (/api/sse).
 * This server-side route then connects to the real backend, adding the secret API key.
 * This keeps the key secure and completely resolves all CORS issues.
 */
export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  const secretKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

  if (!backendUrl || !secretKey) {
    const message = "Server configuration error: Missing SSE environment variables.";
    console.error(`SSE_PROXY_ERROR: ${message}`);
    return new Response(message, { status: 500 });
  }

  const fullBackendEndpoint = `${backendUrl}/api/sse/events`;

  try {
    // This `fetch` happens on the server, not in the browser.
    const response = await fetch(fullBackendEndpoint, {
      method: 'GET',
      headers: {
        'x-api-key': secretKey, // Add the secret header securely here.
        'Accept': 'text/event-stream',
      },
      cache: 'no-store', // Ensure it's a fresh request.
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      console.error(`SSE_PROXY_ERROR: Failed to connect to backend. Status: ${response.status}`, errorText);
      return new Response(`Failed to connect to backend event stream.`, { status: 502 });
    }

    // Create a new ReadableStream to pipe the data from the backend to the browser.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(chunk);
            push();
          }).catch(err => {
            console.error('SSE_PROXY_ERROR: Error reading from backend stream:', err);
            controller.error(err);
          });
        }
        push();
      },
    });

    // Return the stream to the browser.
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("SSE_PROXY_ERROR: Could not connect to the backend service. Is the Express server running?", error);
    return new Response("Bad gateway: Could not connect to the backend service.", { status: 502 });
  }
}