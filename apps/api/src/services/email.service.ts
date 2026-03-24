import { resend } from '../config/resend';

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@gigforge.ai';

export class EmailService {
  async sendProposalNotification(params: {
    clientEmail: string;
    clientName: string;
    gigTitle: string;
    freelancerName: string;
  }) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.clientEmail,
      subject: `New Proposal on "${params.gigTitle}"`,
      html: `
        <h2>New Proposal Received</h2>
        <p>Hi ${params.clientName},</p>
        <p><strong>${params.freelancerName}</strong> submitted a proposal for your gig <strong>"${params.gigTitle}"</strong>.</p>
        <p><a href="${process.env.FRONTEND_URL}/dashboard/gigs">Review proposals →</a></p>
      `,
    });
  }

  async sendProposalAccepted(params: {
    freelancerEmail: string;
    freelancerName: string;
    gigTitle: string;
  }) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.freelancerEmail,
      subject: `🎉 Your proposal was accepted for "${params.gigTitle}"`,
      html: `
        <h2>Congratulations!</h2>
        <p>Hi ${params.freelancerName},</p>
        <p>Your proposal for <strong>"${params.gigTitle}"</strong> has been accepted!</p>
        <p><a href="${process.env.FRONTEND_URL}/dashboard">Go to dashboard →</a></p>
      `,
    });
  }

  async sendPaymentReleased(params: {
    freelancerEmail: string;
    freelancerName: string;
    amount: number;
    gigTitle: string;
  }) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.freelancerEmail,
      subject: `💰 Payment of $${params.amount} released`,
      html: `
        <h2>Payment Released</h2>
        <p>Hi ${params.freelancerName},</p>
        <p>A payment of <strong>$${params.amount}</strong> has been released for <strong>"${params.gigTitle}"</strong>.</p>
        <p>Funds will arrive in your bank account within 2-3 business days.</p>
      `,
    });
  }
}

export const emailService = new EmailService();
