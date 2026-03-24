import { Router, Response } from 'express';
import { User } from '../models/User';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user profile by ID
router.get('/:id', async (req, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || (!user.isActive && (req as AuthenticatedRequest).userId !== user._id.toString())) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update profile
router.patch('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          name: req.body.name,
          bio: req.body.bio,
          headline: req.body.headline,
          location: req.body.location,
          timezone: req.body.timezone,
          websiteUrl: req.body.websiteUrl,
          linkedinUrl: req.body.linkedinUrl,
          githubUrl: req.body.githubUrl,
        }
      },
      { new: true }
    );

    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Complete onboarding
router.post('/onboarding', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, headline, bio, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          role,
          headline,
          bio,
          onboardingDone: true,
        },
        $push: {
          skills: { $each: skills || [] }
        }
      },
      { new: true }
    );

    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
});

// Browse freelancers
router.get('/', async (req, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { role: 'FREELANCER', isActive: true, onboardingDone: true };

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.json({
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch freelancers' });
  }
});

export default router;
