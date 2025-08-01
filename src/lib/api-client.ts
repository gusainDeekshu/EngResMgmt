// src/lib/api-client.ts

/**
 * A simple client to make requests from the browser to the Next.js server's API routes.
 * @param endpoint The local API path (e.g., "/api/get-secret-message").
 * @param options Standard fetch options.
 */
async function apiClient(endpoint: string, options: RequestInit = {}) {
  // Use the PUBLIC base URL.
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log("Base URL apiClient:", baseUrl);
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not defined in your .env.local file."
    );
  }

  const fullUrl = `${baseUrl}${endpoint}`;

  // Make the call to our own Next.js server.
  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(errorBody.error || "An unknown API error occurred");
  }

  return response.json();
}

export function getClient(endpoint: string) {
  return apiClient(endpoint, { method: "GET" });
}


// --- ADD THIS NEW FUNCTION ---
export function postClient(endpoint: string, body: any) {
  return apiClient(endpoint, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// --- ADD THIS FUNCTION FOR FILE DOWNLOADS ---
export async function postClientForFile(endpoint: string, body: any) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");

    const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'File generation failed' }));
        throw new Error(errorBody.error);
    }
    
    // Return the raw response so the component can handle the blob
    return response;
}