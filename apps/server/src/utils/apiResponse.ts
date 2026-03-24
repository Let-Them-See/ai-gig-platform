import { Response } from 'express';
import type { ApiSuccessResponse, ApiErrorResponse } from '@gigforge/types';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const response: ApiSuccessResponse<T> = { success: true, data };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode = 400
): void {
  const response: ApiErrorResponse = {
    success: false,
    error: { message, code },
  };
  res.status(statusCode).json(response);
}
