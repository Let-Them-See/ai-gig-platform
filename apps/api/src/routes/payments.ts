import { Router, Response } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { paymentService } from '../services/payment.service';
import { User } from '../models/User';

const router = Router();

// Create Stripe Connect account (freelancer)
router.post('/connect', requireAuth, requireRole('FREELANCER'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const url = await paymentService.createConnectAccount(req.userId!, req.user!.email);
    res.json({ data: { url } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Stripe account' });
  }
});

// Create escrow payment (client)
router.post('/escrow', requireAuth, requireRole('CLIENT'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { gigId } = req.body;
    const user = await User.findById(req.userId).lean();

    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No payment method configured' });
    }

    const clientSecret = await paymentService.createEscrowPayment(gigId, user.stripeCustomerId);
    res.json({ data: { clientSecret } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Release payment (client)
router.post('/release', requireAuth, requireRole('CLIENT'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transfer = await paymentService.releasePayment(req.body.gigId);
    res.json({ data: transfer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to release payment' });
  }
});

export default router;
