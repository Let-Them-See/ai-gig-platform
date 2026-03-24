import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { proposalService } from '../services/proposal.service';

const router = Router();

const submitProposalSchema = z.object({
  body: z.object({
    gigId: z.string().min(1),
    coverLetter: z.string().min(50),
    bidAmount: z.number().positive(),
    deliveryDays: z.number().int().positive(),
  }),
});

// Submit proposal (freelancer only)
router.post(
  '/',
  requireAuth,
  requireRole('FREELANCER'),
  validate(submitProposalSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const proposal = await proposalService.submitProposal({
        gigId: req.body.gigId,
        freelancerId: req.userId!,
        coverLetter: req.body.coverLetter,
        bidAmount: req.body.bidAmount,
        deliveryDays: req.body.deliveryDays,
      });

      res.status(201).json({ data: proposal });
    } catch (err) {
      res.status(500).json({ error: 'Failed to submit proposal' });
    }
  }
);

// Get proposals for a gig (client only for their gigs)
router.get('/gig/:gigId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const proposals = await proposalService.getProposalsForGig(req.params.gigId);
    res.json({ data: proposals });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Get freelancer's own proposals
router.get('/my', requireAuth, requireRole('FREELANCER'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const proposals = await proposalService.getFreelancerProposals(req.userId!);
    res.json({ data: proposals });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Accept proposal (client only)
router.patch('/:id/accept', requireAuth, requireRole('CLIENT'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const proposal = await proposalService.acceptProposal(req.params.id);
    res.json({ data: proposal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept proposal' });
  }
});

// Reject proposal (client only)
router.patch('/:id/reject', requireAuth, requireRole('CLIENT'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const proposal = await proposalService.rejectProposal(req.params.id);
    res.json({ data: proposal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject proposal' });
  }
});

export default router;
