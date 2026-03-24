import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Sync user after Clerk sign-in
router.post('/sync', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findOne({ clerkId: req.user!.clerkId });

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Get current user profile
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
