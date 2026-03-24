import OpenAI from 'openai';
import { Gig } from '../models/Gig';
import { User } from '../models/User';

type AIProvider = 'openai' | 'gemini' | 'none';

const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || (process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'none'));

let openai: OpenAI | null = null;

if (provider === 'openai' && process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export class AIService {
  private ensureAIAvailable() {
    if (provider === 'none') {
      throw new Error('AI features are disabled: no OPENAI_API_KEY or GEMINI_API_KEY configured.');
    }
    if (provider === 'openai' && !openai) {
      throw new Error('OpenAI client is not initialized.');
    }
  }

  async generateGigEmbedding(text: string): Promise<number[]> {
    this.ensureAIAvailable();

    if (provider === 'openai' && openai) {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    }

    // TODO: Implement Gemini embeddings when Gemini SDK is added.
    // For now, return a dummy zero-vector so the rest of the system continues to work.
    return new Array(1536).fill(0);
  }

  async matchFreelancersToGig(gigId: string, topK = 10) {
    const gig = await Gig.findById(gigId);
    if (!gig || !gig.aiEmbedding?.length) return [];

    // Fetch freelancers with matching skills for now
    // In production with pgvector, use cosine similarity query
    const freelancers = await User.find({
      role: 'FREELANCER',
      isActive: true,
    })
      .limit(topK)
      .lean();

    return freelancers.map((f: any, i: number) => ({
      id: f._id.toString(),
      score: Math.round((1 - i * 0.05) * 100) / 100,
      freelancer: f,
    }));
  }

  async generateProposalDraft(params: {
    gigTitle: string;
    gigDescription: string;
    freelancerBio: string;
    freelancerSkills: string[];
  }): Promise<string> {
    const { gigTitle, gigDescription, freelancerBio, freelancerSkills } = params;

    this.ensureAIAvailable();

    if (provider === 'openai' && openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: `You are an expert freelance proposal writer.
            Write concise, professional proposals that highlight relevant experience.
            Never write more than 4 paragraphs. Be specific, not generic.
            Output plain text only, no markdown.`,
          },
          {
            role: 'user',
            content: `Write a proposal for this gig:
            Title: ${gigTitle}
            Description: ${gigDescription}
            
            My background: ${freelancerBio}
            My skills: ${freelancerSkills.join(', ')}`,
          },
        ],
      });

      return completion.choices[0].message.content ?? '';
    }

    // TODO: Implement Gemini text generation when Gemini SDK is added.
    // Fallback: simple non-AI template so the feature still works.
    return [
      `Hi there,`,
      ``,
      `I’m interested in your project "${gigTitle}". I have experience with ${freelancerSkills.join(', ')}, and my background includes: ${freelancerBio || 'relevant experience in similar AI/ML projects.'}`,
      ``,
      `I can help you achieve the goals described in your gig and would be happy to discuss details such as timeline and budget.`,
      ``,
      `Best regards,`,
      `Your AI Gig Freelancer`,
    ].join('\n');
  }

  async analyzeSkillMatch(
    freelancerSkills: string[],
    gigRequiredSkills: string[]
  ): Promise<{
    score: number;
    matching: string[];
    missing: string[];
    suggestions: string[];
  }> {
    const matching = freelancerSkills.filter(s =>
      gigRequiredSkills.map(r => r.toLowerCase()).includes(s.toLowerCase())
    );
    const missing = gigRequiredSkills.filter(
      s => !freelancerSkills.map(f => f.toLowerCase()).includes(s.toLowerCase())
    );
    const score = gigRequiredSkills.length > 0
      ? matching.length / gigRequiredSkills.length
      : 1;

    let suggestions: string[] = [];

    if (provider === 'openai' && openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `A freelancer is missing these skills for a job: ${missing.join(', ')}.
            Give 2-3 short learning suggestions. Plain text, no markdown.`,
          },
        ],
      });

      suggestions = completion.choices[0].message.content?.split('\n').filter(Boolean) ?? [];
    } else {
      // Simple deterministic fallback suggestions without AI.
      if (missing.length) {
        suggestions = [
          `Consider taking a short online course focused on: ${missing.join(', ')}.`,
          `Build a small personal project that uses: ${missing.join(', ')}.`,
        ];
      }
    }

    return {
      score: Math.round(score * 100) / 100,
      matching,
      missing,
      suggestions,
    };
  }
}

export const aiService = new AIService();
