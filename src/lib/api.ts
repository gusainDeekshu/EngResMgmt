async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  if (options.body) {
    headers.append("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || "An unknown error occurred");
  }
  
  if (res.status === 204) return null; // No Content
  return res.json();
}

export function get(url: string) {
  return fetchWithAuth(url);
}

export function post(url: string, data: any) {
  return fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function put(url: string, data: any) {
  return fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function del(url: string) {
  return fetchWithAuth(url, { method: "DELETE" });
} 