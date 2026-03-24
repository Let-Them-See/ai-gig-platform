import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'], default: 'PENDING' },
  aiScore: { type: Number }
}, { timestamps: true });

proposalSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export const Proposal = mongoose.model('Proposal', proposalSchema);
