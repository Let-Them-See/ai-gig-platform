import { Response } from 'express';
import { prisma } from '@gigforge/db';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { parseSkills } from '../utils/skills';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function getFreelancerDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      sendError(res, 'Profile not found', 'NOT_FREELANCER', 403);
      return;
    }

    const applications = await prisma.application.findMany({
      where: { freelancerId: profile.id },
      include: { gig: true },
    });

    const totalApplications = applications.length;
    const matchScores = applications
      .map((a) => a.matchScore)
      .filter((s): s is number => s !== null);
    const averageMatchScore =
      matchScores.length > 0
        ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length)
        : 0;

    const statusBreakdown: Record<string, number> = {
      PENDING: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
      HIRED: 0,
    };
    for (const app of applications) {
      statusBreakdown[app.status] = (statusBreakdown[app.status] ?? 0) + 1;
    }

    // Top skills from profile
    const topSkills = parseSkills(profile.skills).slice(0, 10);

    // Resume completeness
    let resumeCompleteness = 0;
    if (profile.bio) resumeCompleteness += 15;
    if (parseSkills(profile.skills).length > 0) resumeCompleteness += 25;
    if (profile.location) resumeCompleteness += 10;
    if (profile.hourlyRate) resumeCompleteness += 10;
    if (profile.resumeText) resumeCompleteness += 20;
    if (profile.githubUrl) resumeCompleteness += 10;
    if (profile.portfolioUrl) resumeCompleteness += 10;

    sendSuccess(res, {
      totalApplications,
      averageMatchScore,
      statusBreakdown,
      topSkills,
      resumeCompleteness,
      topMatches: [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Dashboard failed';
    sendError(res, message, 'DASHBOARD_FAILED', 500);
  }
}

export async function getClientDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!clientProfile) {
      sendError(res, 'Profile not found', 'NOT_CLIENT', 403);
      return;
    }

    const gigs = await prisma.gig.findMany({
      where: { clientId: clientProfile.id },
      include: {
        applications: {
          include: {
            freelancer: { include: { user: { select: { name: true, avatarUrl: true } } } },
          },
        },
      },
    });

    const totalGigs = gigs.length;
    const allApps = gigs.flatMap((g) => g.applications);
    const totalApplicants = allApps.length;
    const hired = allApps.filter((a) => a.status === 'HIRED').length;
    const hiringRate = totalApplicants > 0 ? Math.round((hired / totalApplicants) * 100) : 0;

    const statusBreakdown: Record<string, number> = {
      PENDING: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
      HIRED: 0,
    };
    for (const app of allApps) {
      statusBreakdown[app.status] = (statusBreakdown[app.status] ?? 0) + 1;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApps = allApps.filter((a) => a.createdAt >= thirtyDaysAgo);
    const dateMap: Record<string, number> = {};
    for (const app of recentApps) {
      const dateStr = app.createdAt.toISOString().split('T')[0]!;
      dateMap[dateStr] = (dateMap[dateStr] ?? 0) + 1;
    }
    const applicantsOverTime = Object.entries(dateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topCandidates = allApps
      .filter((a) => a.matchScore !== null)
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, 5)
      .map((a) => {
        const gig = gigs.find((g) => g.id === a.gigId);
        return {
          freelancer: {
            ...a.freelancer,
            skills: parseSkills(a.freelancer.skills),
            user: a.freelancer.user,
          },
          matchScore: a.matchScore ?? 0,
          gigTitle: gig?.title ?? 'Unknown',
        };
      });

    sendSuccess(res, {
      totalGigs,
      totalApplicants,
      hiringRate,
      applicantsOverTime,
      statusBreakdown,
      topCandidates,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Dashboard failed';
    sendError(res, message, 'DASHBOARD_FAILED', 500);
  }
}
