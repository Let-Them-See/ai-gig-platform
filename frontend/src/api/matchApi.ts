import API_BASE from "./api";
import { apiFetch } from "./client";

export const getMatches = async () => {
  // log that user requested matches - this triggers view interactions if implemented backend
  await fetch(`${API_BASE}/interactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ action: "view" })
  }).catch(() => {});

  const res = await apiFetch(`/match`, {
    method: "GET"
  });

  // surface HTTP errors so callers can react (eg redirect to login)
  if (!res.ok) {
    let msg = `Request failed with status ${res.status}`;
    try {
      const payload = await res.json();
      if (payload && payload.message) msg = payload.message;
    } catch (e) {}
    throw new Error(msg);
  }

  return res.json();
};

export const getApplicantsForGig = async (gigId: string) => {
  const res = await apiFetch(`/match/gig/${gigId}/applicants`, {
    method: "GET"
  });

  if (!res.ok) {
    const payload = await res.json().catch(()=>null);
    throw new Error(payload?.message || `Request failed ${res.status}`);
  }

  return res.json();
};

export const updateMatchStatus = async (matchId: string, status: string) => {
  const res = await apiFetch(`/match/${matchId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(()=>null);
    throw new Error(payload?.message || `Request failed ${res.status}`);
  }

  return res.json();
};