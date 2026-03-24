import Stripe from 'stripe';
import { env } from '../config/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function createConnectAccount(
  email: string,
  userId: string
): Promise<{ url: string; accountId: string }> {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    metadata: { userId },
    capabilities: {
      transfers: { requested: true },
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${env.FRONTEND_URL}/profile?stripe=refresh`,
    return_url: `${env.FRONTEND_URL}/profile?stripe=success`,
    type: 'account_onboarding',
  });

  return { url: accountLink.url, accountId: account.id };
}

export async function createPaymentIntent(params: {
  amount: number;
  freelancerStripeId: string;
  applicationFeePercent?: number;
}): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const feePercent = params.applicationFeePercent ?? 10;
  const applicationFeeAmount = Math.round((params.amount * feePercent) / 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: params.amount,
    currency: 'usd',
    application_fee_amount: applicationFeeAmount,
    transfer_data: {
      destination: params.freelancerStripeId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret ?? '',
    paymentIntentId: paymentIntent.id,
  };
}

export async function handleWebhookEvent(
  rawBody: Buffer,
  signature: string
): Promise<{ type: string; data: Record<string, unknown> }> {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  return {
    type: event.type,
    data: event.data.object as Record<string, unknown>,
  };
}
