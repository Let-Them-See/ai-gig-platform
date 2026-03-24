import { Request, Response } from 'express';
import { prisma } from '@gigforge/db';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as stripeService from '../services/stripe.service';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function createConnectAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      sendError(res, 'User not found', 'NOT_FOUND', 404);
      return;
    }

    const result = await stripeService.createConnectAccount(user.email, user.id);
    sendSuccess(res, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe account creation failed';
    sendError(res, message, 'STRIPE_FAILED', 500);
  }
}

export async function createPaymentIntent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const { amount, freelancerStripeId } = req.body;

    const result = await stripeService.createPaymentIntent({
      amount,
      freelancerStripeId,
      applicationFeePercent: 10,
    });

    sendSuccess(res, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment intent creation failed';
    sendError(res, message, 'PAYMENT_FAILED', 500);
  }
}

export async function handleWebhook(req: Request, res: Response): Promise<void> {
  try {
    const sig = req.headers['stripe-signature'] as string;
    if (!sig) {
      sendError(res, 'Missing stripe signature', 'MISSING_SIGNATURE', 400);
      return;
    }

    const event = await stripeService.handleWebhookEvent(
      req.body as Buffer,
      sig
    );

    // Handle specific events
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data;
      const applicationId = paymentIntent.metadata?.applicationId as string | undefined;

      if (applicationId) {
        await prisma.application.update({
          where: { id: applicationId },
          data: { status: 'HIRED' },
        });
      }
    }

    sendSuccess(res, { received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook handling failed';
    sendError(res, message, 'WEBHOOK_FAILED', 400);
  }
}
