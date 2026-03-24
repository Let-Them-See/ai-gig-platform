import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import * as matchController from '../controllers/match.controller';

const router = Router();

router.get('/', requireAuth, requireRole('FREELANCER'), matchController.getMatches);
router.get('/:gigId', requireAuth, requireRole('FREELANCER'), matchController.getMatchForGig);

export default router;
