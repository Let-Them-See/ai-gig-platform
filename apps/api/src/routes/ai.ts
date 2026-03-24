import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimit';
import { aiService } from '../services/ai.service';
import { Gig } from '../models/Gig';
import { User } from '../models/User';

const router = Router();

// Generate proposal draft
router.post('/proposal-draft', requireAuth, aiLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { gigId } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });

    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const draft = await aiService.generateProposalDraft({
      gigTitle: gig.title,
      gigDescription: gig.description,
      freelancerBio: user.bio || '',
      freelancerSkills: user.skills.map((s: any) => s.skill),
    });

    res.json({ data: { draft } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate proposal' });
  }
});

// Match freelancers to gig
router.get('/match/:gigId', requireAuth, aiLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const matches = await aiService.matchFreelancersToGig(req.params.gigId);
    res.json({ data: matches });
  } catch (err) {
    res.status(500).json({ error: 'Failed to match freelancers' });
  }
});

// Analyze skill match
router.post('/skill-match', requireAuth, aiLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { freelancerSkills, gigRequiredSkills } = req.body;
    const analysis = await aiService.analyzeSkillMatch(freelancerSkills, gigRequiredSkills);
    res.json({ data: analysis });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze skill match' });
  }
});

export default router;
