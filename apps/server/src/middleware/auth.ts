import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      sendError(res, 'Missing or invalid authorization header', 'UNAUTHORIZED', 401);
      return;
    }

    const token = header.split(' ')[1];
    if (!token) {
      sendError(res, 'Token not provided', 'UNAUTHORIZED', 401);
      return;
    }

    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 'UNAUTHORIZED', 401);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || (!roles.includes(req.userRole) && req.userRole !== 'ADMIN')) {
      sendError(res, 'Forbidden: insufficient role', 'FORBIDDEN', 403);
      return;
    }
    next();
  };
};
