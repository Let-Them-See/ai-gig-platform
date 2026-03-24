import { prisma } from '@gigforge/db';
import { extractSkillsFromText, rankGigsForFreelancer } from '@gigforge/ai';
import { serializeSkills, parseSkills } from '../utils/skills';

export async function processResume(
  userId: string,
  fileBuffer: Buffer,
  originalName: string
): Promise<{ skills: string[]; textPreview: string; recommendedJobs: any[] }> {
  // Dynamic import for pdf-parse (CommonJS module)
  const pdfParse = (await import('pdf-parse')).default;

  const pdfData = await pdfParse(fileBuffer);
  const resumeText = pdfData.text;

  // Extract skills using AI engine
  const skills = extractSkillsFromText(resumeText);

  // Update freelancer profile — skills stored as JSON string in SQLite
  await prisma.freelancerProfile.update({
    where: { userId },
    data: {
      resumeText,
      resumeUrl: originalName,
      skills: serializeSkills(skills),
    },
  });

  // Get AI-recommended jobs from the dataset
  const openGigs = await prisma.gig.findMany({
    where: { status: 'OPEN' },
    include: {
      client: { include: { user: { select: { name: true, avatarUrl: true } } } },
    },
    take: 200,
    orderBy: { createdAt: 'desc' },
  });

  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId },
  });

  let recommendedJobs: any[] = [];

  if (profile) {
    const ranked = rankGigsForFreelancer(
      {
        skills,
        resumeText,
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

    const gigMap = new Map(openGigs.map((g) => [g.id, g]));

    recommendedJobs = ranked.slice(0, 10).map((match) => {
      const gig = gigMap.get(match.gigId)!;
      return {
        gigId: gig.id,
        title: gig.title,
        location: gig.location,
        isRemote: gig.isRemote,
        budgetMin: gig.budgetMin,
        budgetMax: gig.budgetMax,
        category: gig.category,
        experienceLevel: gig.experienceLevel,
        jobType: gig.jobType,
        payType: gig.payType,
        skills: parseSkills(gig.skills),
        totalScore: match.result.totalScore,
        matchedSkills: match.result.matchedSkills,
        missingSkills: match.result.missingSkills,
        client: {
          companyName: gig.client.companyName,
          user: gig.client.user,
        },
      };
    });
  }

  return {
    skills,
    textPreview: resumeText.substring(0, 500),
    recommendedJobs,
  };
}
