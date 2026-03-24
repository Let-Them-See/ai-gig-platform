import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true, unique: true },
  amount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  freelancerPayout: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'ESCROWED', 'RELEASED', 'REFUNDED', 'DISPUTED'], default: 'PENDING' },
  stripePaymentIntentId: { type: String },
  stripeTransferId: { type: String },
  paidAt: { type: Date },
  releasedAt: { type: Date }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
