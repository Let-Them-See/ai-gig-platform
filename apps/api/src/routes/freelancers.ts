import { Router } from 'express';
import { matchJobsFromResume } from '../services/jobMatch.service';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/resume-match', requireAuth, (req, res) => {
  const { resumeText } = req.body as { resumeText?: string };

  if (!resumeText || typeof resumeText !== 'string') {
    return res.status(400).json({ error: 'resumeText is required' });
  }

  try {
    const matches = matchJobsFromResume(resumeText);
    return res.json({
      data: matches.map((m) => ({
        jobId: m.job.job_id,
        title: m.job.job_title,
        type: m.job.job_type,
        location: m.job.location,
        experienceLevel: m.job.experience_level,
        payType: m.job.pay_type,
        payAmountINR: m.job.pay_amount,
        category: m.job.category,
        underservedFocus: m.job.underserved_focus,
        matchScore: Math.round(m.score * 100),
        matchedSkills: m.matchedSkills,
        requiredSkills: m.job.required_skills,
      })),
    });
  } catch (err: any) {
    console.error('Error matching jobs from resume:', err);
    return res.status(500).json({ error: 'Failed to match jobs from resume' });
  }
});

export default router;

