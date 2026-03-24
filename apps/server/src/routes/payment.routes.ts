import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import * as paymentController from '../controllers/payment.controller';
import express from 'express';

const router = Router();

router.post(
  '/create-connect-account',
  requireAuth,
  requireRole('FREELANCER'),
  paymentController.createConnectAccount
);

router.post(
  '/create-payment-intent',
  requireAuth,
  requireRole('CLIENT'),
  paymentController.createPaymentIntent
);

// Webhook needs raw body - use express.raw middleware
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

export default router;
