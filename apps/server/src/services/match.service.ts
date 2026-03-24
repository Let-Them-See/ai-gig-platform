import { prisma } from '@gigforge/db';
import { computeMatch, rankGigsForFreelancer } from '@gigforge/ai';
import { parseSkills, serializeJson } from '../utils/skills';
import type { MatchResultData } from '@gigforge/types';

export async function getMatchesForFreelancer(
  userId: string,
  limit = 10
): Promise<MatchResultData[]> {
  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Freelancer profile not found');
  }

  const profileSkills = parseSkills(profile.skills);

  const openGigs = await prisma.gig.findMany({
    where: { status: 'OPEN' },
    include: {
      client: { include: { user: { select: { name: true, avatarUrl: true } } } },
    },
    take: 50,
    orderBy: { createdAt: 'desc' },
  });

  const ranked = rankGigsForFreelancer(
    {
      skills: profileSkills,
      resumeText: profile.resumeText ?? '',
      location: profile.location ?? undefined,
      hourlyRate: profile.hourlyRate ?? undefined,
    },
    openGigs.map((gig) => ({
      id: gig.id,
      skills: parseSkills(gig.skills),
      description: gig.description,
      location: gig.location ?? undefined,
      isRemote: gig.isRemote,
      budgetMin: gig.budgetMin ?? undefined,
      budgetMax: gig.budgetMax ?? undefined,
    }))
  );

  const topRanked = ranked.slice(0, limit);

  // Save match histories
  for (const match of topRanked) {
    const existingMatch = await prisma.matchHistory.findFirst({
      where: {
        freelancerId: profile.id,
        gigId: match.gigId,
      },
    });

    if (existingMatch) {
      await prisma.matchHistory.update({
        where: { id: existingMatch.id },
        data: {
          score: match.result.totalScore,
          breakdown: serializeJson(match.result.breakdown),
        },
      });
    } else {
      await prisma.matchHistory.create({
        data: {
          freelancerId: profile.id,
          gigId: match.gigId,
          score: match.result.totalScore,
          breakdown: serializeJson(match.result.breakdown),
        },
      });
    }
  }

  // Map to response shape
  const gigMap = new Map(openGigs.map((g) => [g.id, g]));

  return topRanked.map((match) => {
    const gig = gigMap.get(match.gigId)!;
    return {
      gigId: match.gigId,
      totalScore: match.result.totalScore,
      breakdown: match.result.breakdown,
      matchedSkills: match.result.matchedSkills,
      missingSkills: match.result.missingSkills,
      gig: {
        id: gig.id,
        title: gig.title,
        description: gig.description,
        skills: parseSkills(gig.skills),
        location: gig.location,
        isRemote: gig.isRemote,
        budgetMin: gig.budgetMin,
        budgetMax: gig.budgetMax,
        status: gig.status,
        clientId: gig.clientId,
        createdAt: gig.createdAt.toISOString(),
        updatedAt: gig.updatedAt.toISOString(),
        client: {
          id: gig.client.id,
          userId: gig.client.userId,
          companyName: gig.client.companyName,
          website: gig.client.website,
          location: gig.client.location,
          bio: gig.client.bio,
          user: gig.client.user
            ? { name: gig.client.user.name, avatarUrl: gig.client.user.avatarUrl }
            : undefined,
        },
      },
    };
  });
}

export async function getMatchForGig(
  userId: string,
  gigId: string
): Promise<MatchResultData | null> {
  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId },
  });
  if (!profile) return null;

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      client: { include: { user: { select: { name: true, avatarUrl: true } } } },
    },
  });
  if (!gig) return null;

  const result = computeMatch({
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

  return {
    gigId: gig.id,
    totalScore: result.totalScore,
    breakdown: result.breakdown,
    matchedSkills: result.matchedSkills,
    missingSkills: result.missingSkills,
    gig: {
      id: gig.id,
      title: gig.title,
      description: gig.description,
      skills: parseSkills(gig.skills),
      location: gig.location,
      isRemote: gig.isRemote,
      budgetMin: gig.budgetMin,
      budgetMax: gig.budgetMax,
      status: gig.status,
      clientId: gig.clientId,
      createdAt: gig.createdAt.toISOString(),
      updatedAt: gig.updatedAt.toISOString(),
      client: {
        id: gig.client.id,
        userId: gig.client.userId,
        companyName: gig.client.companyName,
        website: gig.client.website,
        location: gig.client.location,
        bio: gig.client.bio,
        user: gig.client.user
          ? { name: gig.client.user.name, avatarUrl: gig.client.user.avatarUrl }
          : undefined,
      },
    },
  };
}
