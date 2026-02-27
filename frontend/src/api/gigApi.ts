import API_BASE from "./api";
import { apiFetch } from "./client";

export const createGig = async (data: any) => {
  const res = await apiFetch(`/gigs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getDashboard = async () => {
  const res = await apiFetch(`/gigs/dashboard`, { method: "GET" });

  return res.json();
};

export const getSkillGap = async (gigId: string) => {
  const res = await apiFetch(`/gigs/${gigId}/skill-gap`, { method: "GET" });
  if (!res.ok) throw new Error(`Failed skill gap`);
  return res.json();
};

export const getFreelancerDashboard = async () => {
  const res = await apiFetch(`/gigs/freelancer-dashboard`, { method: "GET" });
  return res.json();
};