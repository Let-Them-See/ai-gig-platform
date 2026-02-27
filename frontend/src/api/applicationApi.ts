import API_BASE from "./api";
import { apiFetch } from "./client";

export const applyToGig = async (gigId: string) => {
  const res = await apiFetch(`/applications/apply/${gigId}`, { method: "POST" });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.message || `Failed to apply (${res.status})`);
  }
  return res.json();
};

export const getMyApplications = async () => {
  const res = await apiFetch(`/applications/my`, { method: "GET" });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.message || `Failed to fetch applications`);
  }
  return res.json();
};

export const getGigApplications = async (gigId: string) => {
  const res = await apiFetch(`/applications/gig/${gigId}`, { method: "GET" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const updateApplicationStatus = async (appId: string, status: string) => {
  const res = await apiFetch(`/applications/${appId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
