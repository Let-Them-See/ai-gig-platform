import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as authService from '../services/auth.service';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password, name, role } = req.body;
    const result = await authService.registerUser(email, password, name, role);
    sendSuccess(res, result, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    sendError(res, message, 'REGISTER_FAILED');
  }
}

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendSuccess(res, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    sendError(res, message, 'LOGIN_FAILED', 401);
  }
}

export async function refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendError(res, 'Refresh token required', 'MISSING_TOKEN');
      return;
    }
    const tokens = await authService.refreshTokens(refreshToken);
    sendSuccess(res, tokens);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Token refresh failed';
    sendError(res, message, 'REFRESH_FAILED', 401);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }
    const user = await authService.getUserById(req.userId);
    if (!user) {
      sendError(res, 'User not found', 'NOT_FOUND', 404);
      return;
    }
    sendSuccess(res, user);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get user';
    sendError(res, message, 'GET_ME_FAILED', 500);
  }
}
