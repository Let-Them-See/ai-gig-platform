import { Router, Response } from 'express';
import { Review } from '../models/Review';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

const createReviewSchema = z.object({
  body: z.object({
    gigId: z.string().min(1),
    receiverId: z.string().min(1),
    rating: z.number().min(1).max(5),
    comment: z.string().min(10),
    isPublic: z.boolean().default(true),
  }),
});

// Get reviews for a user
router.get('/user/:userId', async (req, res: Response) => {
  try {
    const reviews = await Review.find({ receiverId: req.params.userId, isPublic: true })
      .populate('giverId', 'name avatarUrl')
      .populate('gigId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    // Transform populated _id fields to match expected API response
    const formattedReviews = reviews.map((r: any) => ({
      ...r,
      giver: r.giverId,
      gig: r.gigId,
      giverId: undefined,
      gigId: undefined
    }));

    const avgRating = formattedReviews.length
      ? formattedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / formattedReviews.length
      : 0;

    res.json({ data: { reviews: formattedReviews, avgRating, totalReviews: formattedReviews.length } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create a review
router.post(
  '/',
  requireAuth,
  validate(createReviewSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const review = await Review.create({
        gigId: req.body.gigId,
        giverId: req.userId!,
        receiverId: req.body.receiverId,
        rating: req.body.rating,
        comment: req.body.comment,
        isPublic: req.body.isPublic,
      });

      res.status(201).json({ data: review });
    } catch (err) {
      if ((err as any).code === 11000) {
        return res.status(400).json({ error: 'Review already exists for this gig' });
      }
      res.status(500).json({ error: 'Failed to create review' });
    }
  }
);

export default router;
