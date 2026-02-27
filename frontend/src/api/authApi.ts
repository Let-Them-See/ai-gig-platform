import API_BASE from "./api";
import { apiFetch } from "./client";

export const loginUser = async (email: string, password: string) => {
  const res = await apiFetch(`/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const registerUser = async (data: any) => {
  const res = await apiFetch(`/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getProfile = async () => {
  try {
    // server exposes a protected test route that returns the authenticated user
    const res = await apiFetch(`/protected`, { method: "GET" });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
};