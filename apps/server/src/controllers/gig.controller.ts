import { Request, Response } from 'express';
import { prisma } from '@gigforge/db';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { parseSkills, serializeSkills } from '../utils/skills';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function createGig(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!clientProfile) {
      sendError(res, 'Client profile not found', 'NOT_CLIENT', 403);
      return;
    }

    const { title, description, skills, location, isRemote, budgetMin, budgetMax, category, experienceLevel, jobType, payType } = req.body;

    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        skills: serializeSkills(skills ?? []),
        location,
        isRemote: isRemote ?? true,
        budgetMin,
        budgetMax,
        category,
        experienceLevel,
        jobType,
        payType,
        clientId: clientProfile.id,
      },
      include: {
        client: { include: { user: { select: { name: true, avatarUrl: true } } } },
      },
    });

    sendSuccess(res, { ...gig, skills: parseSkills(gig.skills) }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create gig';
    sendError(res, message, 'CREATE_GIG_FAILED', 500);
  }
}

export async function listGigs(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 12;
    const search = req.query.search as string | undefined;

    const where: Record<string, unknown> = { status: 'OPEN' };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [gigs, total] = await Promise.all([
      prisma.gig.findMany({
        where: where as any,
        include: {
          client: { include: { user: { select: { name: true, avatarUrl: true } } } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.gig.count({ where: where as any }),
    ]);

    // Parse skills for each gig
    const parsedGigs = gigs.map((gig) => ({
      ...gig,
      skills: parseSkills(gig.skills),
    }));

    // Client-side filtering for skills (SQLite doesn't support hasSome)
    const skillsFilter = req.query.skills ? (req.query.skills as string).split(',').map(s => s.toLowerCase()) : undefined;
    const isRemoteFilter = req.query.isRemote === 'true' ? true : req.query.isRemote === 'false' ? false : undefined;
    const categoryFilter = req.query.category as string | undefined;
    const experienceFilter = req.query.experienceLevel as string | undefined;

    let filtered = parsedGigs;
    if (skillsFilter?.length) {
      filtered = filtered.filter((gig) =>
        gig.skills.some((s: string) => skillsFilter.includes(s.toLowerCase()))
      );
    }
    if (isRemoteFilter !== undefined) {
      filtered = filtered.filter((gig) => gig.isRemote === isRemoteFilter);
    }
    if (categoryFilter) {
      filtered = filtered.filter((gig) => gig.category?.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (experienceFilter) {
      filtered = filtered.filter((gig) => gig.experienceLevel?.toLowerCase() === experienceFilter.toLowerCase());
    }

    sendSuccess(res, {
      items: filtered,
      total: skillsFilter || isRemoteFilter !== undefined ? filtered.length : total,
      page,
      pageSize,
      totalPages: Math.ceil((skillsFilter || isRemoteFilter !== undefined ? filtered.length : total) / pageSize),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to list gigs';
    sendError(res, message, 'LIST_GIGS_FAILED', 500);
  }
}

export async function getGig(req: Request, res: Response): Promise<void> {
  try {
    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id },
      include: {
        client: { include: { user: { select: { name: true, avatarUrl: true } } } },
        applications: {
          include: {
            freelancer: { include: { user: { select: { name: true, avatarUrl: true } } } },
          },
        },
      },
    });

    if (!gig) {
      sendError(res, 'Gig not found', 'NOT_FOUND', 404);
      return;
    }

    sendSuccess(res, { ...gig, skills: parseSkills(gig.skills) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get gig';
    sendError(res, message, 'GET_GIG_FAILED', 500);
  }
}

export async function updateGig(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id },
      include: { client: true },
    });

    if (!gig) {
      sendError(res, 'Gig not found', 'NOT_FOUND', 404);
      return;
    }

    if (gig.client.userId !== req.userId) {
      sendError(res, 'Not authorized to update this gig', 'FORBIDDEN', 403);
      return;
    }

    const { title, description, skills, location, isRemote, budgetMin, budgetMax, status, category, experienceLevel, jobType, payType } = req.body;

    const updated = await prisma.gig.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(skills !== undefined && { skills: serializeSkills(skills) }),
        ...(location !== undefined && { location }),
        ...(isRemote !== undefined && { isRemote }),
        ...(budgetMin !== undefined && { budgetMin }),
        ...(budgetMax !== undefined && { budgetMax }),
        ...(status !== undefined && { status }),
        ...(category !== undefined && { category }),
        ...(experienceLevel !== undefined && { experienceLevel }),
        ...(jobType !== undefined && { jobType }),
        ...(payType !== undefined && { payType }),
      },
      include: {
        client: { include: { user: { select: { name: true, avatarUrl: true } } } },
      },
    });

    sendSuccess(res, { ...updated, skills: parseSkills(updated.skills) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update gig';
    sendError(res, message, 'UPDATE_GIG_FAILED', 500);
  }
}

export async function deleteGig(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id },
      include: { client: true },
    });

    if (!gig) {
      sendError(res, 'Gig not found', 'NOT_FOUND', 404);
      return;
    }

    if (gig.client.userId !== req.userId) {
      sendError(res, 'Not authorized to delete this gig', 'FORBIDDEN', 403);
      return;
    }

    await prisma.gig.delete({ where: { id: req.params.id } });
    sendSuccess(res, { message: 'Gig deleted' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete gig';
    sendError(res, message, 'DELETE_GIG_FAILED', 500);
  }
}
