import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true, unique: true },
  giverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);
