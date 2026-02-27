import API_BASE from "./api";

// simple fetch wrapper that tries to refresh token on 401
export async function apiFetch(input: string, init: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: any = init.headers || {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${input}`, { ...init, headers });
  if (res.status === 401) {
    // attempt refresh
    try {
      const r = await fetch(`${API_BASE}/auth/refresh`, { method: "POST", credentials: "include" });
      if (r.ok) {
        const data = await r.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          headers["Authorization"] = `Bearer ${data.token}`;
          return fetch(`${API_BASE}${input}`, { ...init, headers });
        }
      }
    } catch (e) {
      console.error("refresh failed", e);
    }
  }
  return res;
}
