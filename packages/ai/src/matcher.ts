// ─────────────────────────────────────────────────────────────
// GigForge AI Matching Engine
// TF-IDF + Cosine Similarity + Weighted Hybrid Scoring
// ─────────────────────────────────────────────────────────────

import natural from 'natural';

const TfIdf = natural.TfIdf;

// ── Types ──────────────────────────────────────────────────

export interface MatchInput {
  freelancer: {
    skills: string[];
    resumeText: string;
    location?: string;
    hourlyRate?: number;
  };
  gig: {
    skills: string[];
    description: string;
    location?: string;
    isRemote: boolean;
    budgetMin?: number;
    budgetMax?: number;
  };
}

export interface MatchResult {
  totalScore: number;
  breakdown: {
    skillScore: number;
    semanticScore: number;
    locationScore: number;
    salaryScore: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
}

// ── Score Weights ──────────────────────────────────────────

const WEIGHTS = {
  skill: 0.4,
  semantic: 0.35,
  location: 0.15,
  salary: 0.1,
} as const;

// ── Helper: Normalize strings for comparison ──────────────

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9+#. ]/g, '');
}

// ── 1. Skill Score (Jaccard Similarity) ───────────────────

function computeSkillScore(
  freelancerSkills: string[],
  gigSkills: string[]
): { score: number; matched: string[]; missing: string[] } {
  const fSet = new Set(freelancerSkills.map(normalize));
  const gSet = new Set(gigSkills.map(normalize));

  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of gSet) {
    if (fSet.has(skill)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const union = new Set([...fSet, ...gSet]);
  const score = union.size === 0 ? 0 : (matched.length / union.size) * 100;

  return { score, matched, missing };
}

// ── 2. Semantic Score (TF-IDF Cosine Similarity) ──────────

function computeSemanticScore(resumeText: string, gigDescription: string): number {
  if (!resumeText.trim() || !gigDescription.trim()) return 0;

  const tfidf = new TfIdf();
  tfidf.addDocument(resumeText.toLowerCase());
  tfidf.addDocument(gigDescription.toLowerCase());

  // Build combined term set from both documents
  const terms = new Set<string>();
  tfidf.listTerms(0).forEach((item) => terms.add(item.term));
  tfidf.listTerms(1).forEach((item) => terms.add(item.term));

  if (terms.size === 0) return 0;

  // Build TF-IDF vectors
  const vecA: number[] = [];
  const vecB: number[] = [];

  for (const term of terms) {
    vecA.push(tfidf.tfidf(term, 0));
    vecB.push(tfidf.tfidf(term, 1));
  }

  // Cosine similarity
  const similarity = cosineSimilarity(vecA, vecB);
  return Math.round(similarity * 100);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const valA = a[i] ?? 0;
    const valB = b[i] ?? 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// ── 3. Location Score ─────────────────────────────────────

function computeLocationScore(
  freelancerLocation: string | undefined,
  gigLocation: string | undefined,
  isRemote: boolean
): number {
  if (isRemote) return 80;

  if (!freelancerLocation || !gigLocation) return 50;

  const fLoc = normalize(freelancerLocation);
  const gLoc = normalize(gigLocation);

  if (fLoc === gLoc) return 100;

  // Partial match (e.g., same country or region keyword)
  if (fLoc.includes(gLoc) || gLoc.includes(fLoc)) return 70;

  return 20;
}

// ── 4. Salary Score ───────────────────────────────────────

function computeSalaryScore(
  hourlyRate: number | undefined,
  budgetMin: number | undefined,
  budgetMax: number | undefined
): number {
  if (hourlyRate === undefined || hourlyRate === null) return 50;
  if (budgetMin === undefined && budgetMax === undefined) return 50;

  const min = budgetMin ?? 0;
  const max = budgetMax ?? Infinity;

  if (hourlyRate >= min && hourlyRate <= max) return 100;

  // Within 20% of range
  const range = max === Infinity ? min * 2 : max - min;
  const tolerance = Math.max(range * 0.2, 10);

  if (hourlyRate < min) {
    const diff = min - hourlyRate;
    return diff <= tolerance ? Math.round(80 - (diff / tolerance) * 40) : 20;
  }

  if (max !== Infinity && hourlyRate > max) {
    const diff = hourlyRate - max;
    return diff <= tolerance ? Math.round(80 - (diff / tolerance) * 40) : 20;
  }

  return 50;
}

// ── Main: Compute Match ───────────────────────────────────

export function computeMatch(input: MatchInput): MatchResult {
  const { freelancer, gig } = input;

  const skillResult = computeSkillScore(freelancer.skills, gig.skills);
  const semanticScore = computeSemanticScore(freelancer.resumeText, gig.description);
  const locationScore = computeLocationScore(freelancer.location, gig.location, gig.isRemote);
  const salaryScore = computeSalaryScore(freelancer.hourlyRate, gig.budgetMin, gig.budgetMax);

  const totalScore = Math.round(
    skillResult.score * WEIGHTS.skill +
    semanticScore * WEIGHTS.semantic +
    locationScore * WEIGHTS.location +
    salaryScore * WEIGHTS.salary
  );

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      skillScore: Math.round(skillResult.score),
      semanticScore,
      locationScore,
      salaryScore,
    },
    matchedSkills: skillResult.matched,
    missingSkills: skillResult.missing,
  };
}

// ── Rank Gigs for Freelancer ──────────────────────────────

export function rankGigsForFreelancer(
  freelancer: MatchInput['freelancer'],
  gigs: Array<{ id: string } & MatchInput['gig']>
): Array<{ gigId: string; result: MatchResult }> {
  return gigs
    .map((gig) => ({
      gigId: gig.id,
      result: computeMatch({ freelancer, gig }),
    }))
    .sort((a, b) => b.result.totalScore - a.result.totalScore);
}

// ── Skill Extraction from Text ────────────────────────────

const KNOWN_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
  'react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'node.js', 'nodejs', 'express', 'fastify',
  'django', 'flask', 'spring', 'rails',
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'sqlite',
  'prisma', 'mongoose', 'sequelize', 'typeorm',
  'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ci/cd', 'github actions',
  'graphql', 'rest api', 'grpc', 'websocket', 'socket.io',
  'tailwindcss', 'tailwind', 'css', 'sass', 'html',
  'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
  'openai', 'langchain', 'llm', 'gpt', 'chatgpt',
  'figma', 'photoshop', 'ui/ux', 'design',
  'git', 'linux', 'agile', 'scrum', 'jira',
  'stripe', 'firebase', 'supabase', 'vercel', 'netlify',
  'react native', 'flutter', 'electron',
  'testing', 'jest', 'cypress', 'playwright',
  'blockchain', 'solidity', 'web3', 'ethereum',
  'data analysis', 'pandas', 'numpy', 'scikit-learn', 'r',
];

export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const skill of KNOWN_SKILLS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lower)) {
      found.push(skill);
    }
  }

  return [...new Set(found)];
}
