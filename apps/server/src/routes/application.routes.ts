import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth';
import * as appController from '../controllers/application.controller';

const router = Router();

const applySchema = z.object({
  body: z.object({
    gigId: z.string().min(1, 'Gig ID is required'),
    coverLetter: z.string().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED']),
  }),
});

router.post('/apply', requireAuth, requireRole('FREELANCER'), validate(applySchema), appController.applyToGig);
router.get('/my', requireAuth, requireRole('FREELANCER'), appController.getMyApplications);
router.get('/gig/:gigId', requireAuth, requireRole('CLIENT'), appController.getApplicationsForGig);
router.patch('/:id/status', requireAuth, requireRole('CLIENT'), validate(updateStatusSchema), appController.updateApplicationStatus);
router.get('/client', requireAuth, requireRole('CLIENT'), appController.getClientApplications);

export default router;
