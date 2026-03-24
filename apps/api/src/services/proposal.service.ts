import { Proposal } from '../models/Proposal';
import { Gig } from '../models/Gig';
import { notificationService } from './notification.service';

export class ProposalService {
  async submitProposal(data: {
    gigId: string;
    freelancerId: string;
    coverLetter: string;
    bidAmount: number;
    deliveryDays: number;
    aiScore?: number;
  }) {
    const proposal = await Proposal.create({
      gigId: data.gigId,
      freelancerId: data.freelancerId,
      coverLetter: data.coverLetter,
      bidAmount: data.bidAmount,
      deliveryDays: data.deliveryDays,
      aiScore: data.aiScore,
    });

    const populatedProposal = await Proposal.findById(proposal._id)
      .populate({
        path: 'gigId',
        populate: { path: 'clientId' }
      })
      .populate('freelancerId')
      .lean();

    // Notify the client
    if (populatedProposal && (populatedProposal as any).gigId) {
      await notificationService.create({
        userId: (populatedProposal as any).gigId.clientId._id,
        type: 'PROPOSAL_RECEIVED',
        title: 'New proposal received',
        body: `${(populatedProposal as any).freelancerId.name} submitted a proposal for "${(populatedProposal as any).gigId.title}"`,
        data: { gigId: data.gigId, proposalId: proposal._id },
      });
    }

    return proposal;
  }

  async getProposalsForGig(gigId: string) {
    const proposals = await Proposal.find({ gigId })
      .populate('freelancerId')
      .sort({ aiScore: -1, createdAt: -1 })
      .lean();
      
    return proposals.map((p: any) => ({
      ...p,
      freelancer: p.freelancerId,
      freelancerId: undefined
    }));
  }

  async getFreelancerProposals(freelancerId: string) {
    const proposals = await Proposal.find({ freelancerId })
      .populate({
        path: 'gigId',
        populate: { path: 'clientId', select: 'name avatarUrl' }
      })
      .sort({ createdAt: -1 })
      .lean();

    return proposals.map((p: any) => ({
      ...p,
      gig: p.gigId,
      gigId: undefined
    }));
  }

  async acceptProposal(proposalId: string) {
    const proposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: 'ACCEPTED' },
      { new: true }
    ).populate('gigId').populate('freelancerId');

    if (!proposal) throw new Error('Proposal not found');

    // Update gig status and assign freelancer
    await Gig.findByIdAndUpdate(proposal.gigId, {
      status: 'IN_PROGRESS',
      freelancerId: proposal.freelancerId,
    });

    // Reject all other proposals
    await Proposal.updateMany(
      {
        gigId: proposal.gigId,
        _id: { $ne: proposalId },
        status: 'PENDING',
      },
      { status: 'REJECTED' }
    );

    // Notify freelancer
    await notificationService.create({
      userId: (proposal.freelancerId as any)._id.toString(),
      type: 'PROPOSAL_ACCEPTED',
      title: 'Proposal accepted! 🎉',
      body: `Your proposal for "${(proposal.gigId as any).title}" was accepted`,
      data: { gigId: proposal.gigId },
    });

    return proposal;
  }

  async rejectProposal(proposalId: string) {
    return Proposal.findByIdAndUpdate(
      proposalId,
      { status: 'REJECTED' },
      { new: true }
    );
  }
}

export const proposalService = new ProposalService();
