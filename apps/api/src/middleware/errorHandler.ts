import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).name === 'MongoServerError' && (err as any).code === 11000) {
    res.status(409).json({ error: 'Resource already exists' });
    return;
  }

  // Mongoose invalid ObjectId error
  if ((err as any).name === 'CastError' && (err as any).kind === 'ObjectId') {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};
