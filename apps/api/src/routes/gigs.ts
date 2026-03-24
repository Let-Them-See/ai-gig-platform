import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { gigService } from '../services/gig.service';

const router = Router();

const createGigSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(200),
    description: z.string().min(20),
    requirements: z.string().optional(),
    budget: z.number().positive(),
    budgetType: z.enum(['FIXED', 'HOURLY']).default('FIXED'),
    deadline: z.string().datetime().optional(),
    category: z.string().min(1),
    experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).default('INTERMEDIATE'),
    skillIds: z.array(z.string()).default([]),
    isRemote: z.boolean().default(true),
  }),
});

// Get all gigs with filters
router.get('/', async (req, res: Response) => {
  try {
    const result = await gigService.getGigs({
      category: req.query.category as string,
      minBudget: req.query.minBudget ? Number(req.query.minBudget) : undefined,
      maxBudget: req.query.maxBudget ? Number(req.query.maxBudget) : undefined,
      experienceLevel: req.query.experienceLevel as string,
      status: req.query.status as string,
      search: req.query.search as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      sortBy: req.query.sortBy as string,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

// Get single gig
router.get('/:id', async (req, res: Response) => {
  try {
    const gig = await gigService.getGigById(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    res.json({ data: gig });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gig' });
  }
});

// Create gig (client only)
router.post(
  '/',
  requireAuth,
  requireRole('CLIENT'),
  validate(createGigSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const gig = await gigService.createGig({
        clientId: req.userId!,
        ...req.body,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
      });

      res.status(201).json({ data: gig });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create gig' });
    }
  }
);

export default router;
