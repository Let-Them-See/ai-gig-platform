import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as matchService from '../services/match.service';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function getMatches(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const matches = await matchService.getMatchesForFreelancer(req.userId, limit);
    sendSuccess(res, matches);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get matches';
    sendError(res, message, 'MATCH_FAILED', 500);
  }
}

export async function getMatchForGig(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const match = await matchService.getMatchForGig(req.userId, req.params.gigId);
    if (!match) {
      sendError(res, 'Match not found', 'NOT_FOUND', 404);
      return;
    }
    sendSuccess(res, match);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get match';
    sendError(res, message, 'MATCH_FAILED', 500);
  }
}
