import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

router.get('/freelancer', requireAuth, dashboardController.getFreelancerDashboard);
router.get('/client', requireAuth, dashboardController.getClientDashboard);

export default router;
