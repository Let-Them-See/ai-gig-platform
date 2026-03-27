const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || 'Request failed');
  }
  return data.data as T;
}

// ── Gigs ──────────────────────────────────────────────────

export async function fetchGigs(params?: {
  page?: number;
  pageSize?: number;
  skills?: string;
  location?: string;
  isRemote?: string;
  search?: string;
  category?: string;
  experienceLevel?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  if (params?.skills) query.set('skills', params.skills);
  if (params?.location) query.set('location', params.location);
  if (params?.isRemote) query.set('isRemote', params.isRemote);
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.experienceLevel) query.set('experienceLevel', params.experienceLevel);

  const res = await fetch(`${API_URL}/api/gigs?${query.toString()}`);
  return handleResponse(res);
}

export async function fetchGig(id: string) {
  const res = await fetch(`${API_URL}/api/gigs/${id}`);
  return handleResponse(res);
}

export async function createGig(data: Record<string, unknown>) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/gigs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// ── Matches ───────────────────────────────────────────────

export async function fetchMatches(limit = 10) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/match?limit=${limit}`, { headers });
  return handleResponse(res);
}

export async function fetchMatchForGig(gigId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/match/${gigId}`, { headers });
  return handleResponse(res);
}

// ── Applications ──────────────────────────────────────────

export async function applyToGig(data: { gigId: string; coverLetter?: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/applications/apply`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function fetchMyApplications() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/applications/my`, { headers });
  return handleResponse(res);
}

export async function fetchApplicationsForGig(gigId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/applications/gig/${gigId}`, { headers });
  return handleResponse(res);
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function fetchClientApplications() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/applications/client`, { headers });
  return handleResponse(res);
}

// ── Dashboard ─────────────────────────────────────────────

export async function fetchFreelancerDashboard() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dashboard/freelancer`, { headers });
  return handleResponse(res);
}

export async function fetchClientDashboard() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dashboard/client`, { headers });
  return handleResponse(res);
}

// ── Resume ────────────────────────────────────────────────

export async function uploadResume(file: File) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const formData = new FormData();
  formData.append('resume', file);

  const res = await fetch(`${API_URL}/api/resume/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  return handleResponse(res);
}

// ── Profile ───────────────────────────────────────────────

export async function fetchProfile() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/auth/me`, { headers });
  return handleResponse(res);
}
