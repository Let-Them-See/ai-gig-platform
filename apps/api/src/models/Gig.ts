import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String },
  budget: { type: Number, required: true },
  budgetType: { type: String, default: 'FIXED' },
  deadline: { type: Date },
  status: { type: String, enum: ['DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'], default: 'DRAFT' },
  category: { type: String, required: true },
  experienceLevel: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'EXPERT'], default: 'INTERMEDIATE' },
  attachmentUrls: [{ type: String }],
  isRemote: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  aiEmbedding: [{ type: Number }],
  publishedAt: { type: Date },
  completedAt: { type: Date },
  skills: [{ type: String }]
}, { timestamps: true });

// Create indexes for search and queries
gigSchema.index({ clientId: 1, status: 1 });
gigSchema.index({ category: 1, status: 1 });

export const Gig = mongoose.model('Gig', gigSchema);
