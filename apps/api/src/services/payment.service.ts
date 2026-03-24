import Stripe from 'stripe';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { Gig } from '../models/Gig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
});

export class PaymentService {
  async createConnectAccount(userId: string, email: string) {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        transfers: { requested: true },
      },
    });

    await User.findByIdAndUpdate(userId, { stripeAccountId: account.id });

    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/dashboard/payouts?refresh=true`,
      return_url: `${process.env.FRONTEND_URL}/dashboard/payouts?success=true`,
      type: 'account_onboarding',
    });

    return link.url;
  }

  async createEscrowPayment(gigId: string, clientStripeCustomerId: string) {
    const gig = await Gig.findById(gigId);
    if (!gig) throw new Error('Gig not found');

    const platformFee = gig.budget * 0.10;
    const freelancerPayout = gig.budget - platformFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(gig.budget * 100),
      currency: 'usd',
      customer: clientStripeCustomerId,
      capture_method: 'manual',
      metadata: { gigId, type: 'escrow' },
    });

    await Payment.create({
      gigId,
      amount: gig.budget,
      platformFee,
      freelancerPayout,
      status: 'PENDING',
      stripePaymentIntentId: paymentIntent.id,
    });

    return paymentIntent.client_secret;
  }

  async releasePayment(gigId: string) {
    const payment = await Payment.findOne({ gigId }).populate({
      path: 'gigId',
      populate: { path: 'freelancerId' }
    });
    
    if (!payment || !(payment as any).gigId?.freelancerId?.stripeAccountId) {
      throw new Error('Cannot release payment');
    }

    const freelancerStripeId = (payment as any).gigId.freelancerId.stripeAccountId;

    await stripe.paymentIntents.capture(payment.stripePaymentIntentId!);

    const transfer = await stripe.transfers.create({
      amount: Math.round(payment.freelancerPayout * 100),
      currency: 'usd',
      destination: freelancerStripeId,
      metadata: { gigId },
    });

    await Payment.findOneAndUpdate(
      { gigId },
      {
        status: 'RELEASED',
        stripeTransferId: transfer.id,
        releasedAt: new Date(),
      }
    );

    return transfer;
  }
}

export const paymentService = new PaymentService();
