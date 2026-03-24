import { Router } from 'express';
import authRoutes from './auth';
import gigRoutes from './gigs';
import proposalRoutes from './proposals';
import userRoutes from './users';
import paymentRoutes from './payments';
import messageRoutes from './messages';
import reviewRoutes from './reviews';
import notificationRoutes from './notifications';
import aiRoutes from './ai';
import freelancerRoutes from './freelancers';

const router = Router();

router.use('/auth', authRoutes);
router.use('/gigs', gigRoutes);
router.use('/proposals', proposalRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/messages', messageRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ai', aiRoutes);
router.use('/freelancers', freelancerRoutes);

export default router;
