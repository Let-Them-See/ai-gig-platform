import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/clerk-sdk-node';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    clerkId: string;
    role: string;
    email: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const user = await User.findOne({ clerkId: payload.sub })
      .select('_id clerkId role email')
      .lean();

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.userId = user._id.toString();
    req.user = {
      id: user._id.toString(),
      clerkId: user.clerkId,
      role: user.role,
      email: user.email,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (role: 'CLIENT' | 'FREELANCER' | 'ADMIN') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== role && req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: insufficient role' });
      return;
    }
    next();
  };
};
