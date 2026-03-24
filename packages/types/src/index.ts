// ─────────────────────────────────────────────────────────────
// GigForge — Shared TypeScript Types
// ─────────────────────────────────────────────────────────────

// ── API Response ──────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ── Auth ──────────────────────────────────────────────────

export type Role = 'FREELANCER' | 'CLIENT' | 'ADMIN';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: 'FREELANCER' | 'CLIENT';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
}

// ── Freelancer Profile ────────────────────────────────────

export interface FreelancerProfileData {
  id: string;
  userId: string;
  bio: string | null;
  skills: string[];
  location: string | null;
  hourlyRate: number | null;
  resumeUrl: string | null;
  resumeText: string | null;
  experience: number | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
}

// ── Client Profile ────────────────────────────────────────

export interface ClientProfileData {
  id: string;
  userId: string;
  companyName: string | null;
  website: string | null;
  location: string | null;
  bio: string | null;
}

// ── Gig ───────────────────────────────────────────────────

export type GigStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';

export interface GigData {
  id: string;
  title: string;
  description: string;
  skills: string[];
  location: string | null;
  isRemote: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
  status: GigStatus;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  client?: ClientProfileData & { user?: Pick<AuthUser, 'name' | 'avatarUrl'> };
}

// ── Application ───────────────────────────────────────────

export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';

export interface ApplicationData {
  id: string;
  freelancerId: string;
  gigId: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  matchScore: number | null;
  createdAt: string;
  updatedAt: string;
  gig?: GigData;
  freelancer?: FreelancerProfileData & { user?: Pick<AuthUser, 'name' | 'avatarUrl'> };
}

// ── Match ─────────────────────────────────────────────────

export interface MatchBreakdown {
  skillScore: number;
  semanticScore: number;
  locationScore: number;
  salaryScore: number;
}

export interface MatchResultData {
  gigId: string;
  totalScore: number;
  breakdown: MatchBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  gig: GigData;
}

// ── Dashboard ─────────────────────────────────────────────

export interface FreelancerDashboard {
  totalApplications: number;
  averageMatchScore: number;
  statusBreakdown: Record<ApplicationStatus, number>;
  topMatches: MatchResultData[];
  topSkills: string[];
  resumeCompleteness: number;
}

export interface ClientDashboard {
  totalGigs: number;
  totalApplicants: number;
  hiringRate: number;
  applicantsOverTime: Array<{ date: string; count: number }>;
  statusBreakdown: Record<ApplicationStatus, number>;
  topCandidates: Array<{
    freelancer: FreelancerProfileData & { user?: Pick<AuthUser, 'name'> };
    matchScore: number;
    gigTitle: string;
  }>;
}

// ── Notification ──────────────────────────────────────────

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

// ── Pagination ────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
