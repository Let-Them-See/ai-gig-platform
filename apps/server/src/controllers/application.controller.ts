import { Response } from 'express';
import { prisma } from '@gigforge/db';
import { computeMatch } from '@gigforge/ai';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { parseSkills } from '../utils/skills';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function applyToGig(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const profile = await prisma.freelancerProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      sendError(res, 'Freelancer profile not found', 'NOT_FREELANCER', 403);
      return;
    }

    const { gigId, coverLetter } = req.body;

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) {
      sendError(res, 'Gig not found', 'NOT_FOUND', 404);
      return;
    }

    if (gig.status !== 'OPEN') {
      sendError(res, 'Gig is not accepting applications', 'GIG_CLOSED', 400);
      return;
    }

    // Check for existing application
    const existing = await prisma.application.findFirst({
      where: { freelancerId: profile.id, gigId },
    });
    if (existing) {
      sendError(res, 'You have already applied to this gig', 'DUPLICATE', 409);
      return;
    }

    // Compute match score
    const matchResult = computeMatch({
      freelancer: {
        skills: parseSkills(profile.skills),
        resumeText: profile.resumeText ?? '',
        location: profile.location ?? undefined,
        hourlyRate: profile.hourlyRate ?? undefined,
      },
      gig: {
        skills: parseSkills(gig.skills),
        description: gig.description,
        location: gig.location ?? undefined,
        isRemote: gig.isRemote,
        budgetMin: gig.budgetMin ?? undefined,
        budgetMax: gig.budgetMax ?? undefined,
      },
    });

    const application = await prisma.application.create({
      data: {
        freelancerId: profile.id,
        gigId,
        coverLetter,
        matchScore: matchResult.totalScore,
      },
      include: {
        gig: true,
        freelancer: { include: { user: { select: { name: true, avatarUrl: true } } } },
      },
    });

    // Create notification for client
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { id: gig.clientId },
    });
    if (clientProfile) {
      await prisma.notification.create({
        data: {
          userId: clientProfile.userId,
          title: 'New Application',
          message: `A freelancer applied to "${gig.title}" with a ${matchResult.totalScore}% match score.`,
          link: `/gigs/${gig.id}`,
        },
      });
    }

    sendSuccess(res, {
      ...application,
      gig: { ...application.gig, skills: parseSkills(application.gig.skills) },
    }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to apply';
    sendError(res, message, 'APPLY_FAILED', 500);
  }
}

export async function getMyApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
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
      include: {
        gig: {
          include: {
            client: { include: { user: { select: { name: true, avatarUrl: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = applications.map((app) => ({
      ...app,
      gig: { ...app.gig, skills: parseSkills(app.gig.skills) },
    }));

    sendSuccess(res, parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get applications';
    sendError(res, message, 'GET_APPS_FAILED', 500);
  }
}

export async function getApplicationsForGig(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const gig = await prisma.gig.findUnique({
      where: { id: req.params.gigId },
      include: { client: true },
    });

    if (!gig) {
      sendError(res, 'Gig not found', 'NOT_FOUND', 404);
      return;
    }

    if (gig.client.userId !== req.userId) {
      sendError(res, 'Not authorized', 'FORBIDDEN', 403);
      return;
    }

    const applications = await prisma.application.findMany({
      where: { gigId: req.params.gigId },
      include: {
        freelancer: {
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
      },
      orderBy: { matchScore: 'desc' },
    });

    sendSuccess(res, applications);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get applications';
    sendError(res, message, 'GET_APPS_FAILED', 500);
  }
}

export async function updateApplicationStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        gig: { include: { client: true } },
        freelancer: true,
      },
    });

    if (!application) {
      sendError(res, 'Application not found', 'NOT_FOUND', 404);
      return;
    }

    if (application.gig.client.userId !== req.userId) {
      sendError(res, 'Not authorized', 'FORBIDDEN', 403);
      return;
    }

    const { status } = req.body;

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        gig: true,
        freelancer: { include: { user: { select: { name: true, avatarUrl: true } } } },
      },
    });

    // Notify freelancer
    await prisma.notification.create({
      data: {
        userId: application.freelancer.userId,
        title: `Application ${status.toLowerCase()}`,
        message: `Your application for "${application.gig.title}" has been ${status.toLowerCase()}.`,
        link: `/applications`,
      },
    });

    sendSuccess(res, updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update application';
    sendError(res, message, 'UPDATE_APP_FAILED', 500);
  }
}
