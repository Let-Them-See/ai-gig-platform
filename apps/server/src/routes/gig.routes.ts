import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth';
import * as gigController from '../controllers/gig.controller';

const router = Router();

const createGigSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    skills: z.array(z.string()).optional(),
    location: z.string().optional(),
    isRemote: z.boolean().optional(),
    budgetMin: z.number().positive().optional(),
    budgetMax: z.number().positive().optional(),
    category: z.string().optional(),
    experienceLevel: z.string().optional(),
    jobType: z.string().optional(),
    payType: z.string().optional(),
  }),
});

const updateGigSchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    description: z.string().min(20).optional(),
    skills: z.array(z.string()).optional(),
    location: z.string().optional(),
    isRemote: z.boolean().optional(),
    budgetMin: z.number().positive().optional(),
    budgetMax: z.number().positive().optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED']).optional(),
  }),
});

router.post('/', requireAuth, requireRole('CLIENT'), validate(createGigSchema), gigController.createGig);
router.get('/', gigController.listGigs);
router.get('/:id', gigController.getGig);
router.patch('/:id', requireAuth, requireRole('CLIENT'), validate(updateGigSchema), gigController.updateGig);
router.delete('/:id', requireAuth, requireRole('CLIENT'), gigController.deleteGig);

export default router;
