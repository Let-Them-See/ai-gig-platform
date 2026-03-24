import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatarUrl: { type: String },
  role: { type: String, enum: ['CLIENT', 'FREELANCER', 'ADMIN'], default: 'CLIENT' },
  bio: { type: String },
  headline: { type: String },
  location: { type: String },
  timezone: { type: String },
  websiteUrl: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  onboardingDone: { type: Boolean, default: false },
  stripeAccountId: { type: String },
  stripeCustomerId: { type: String },
  skills: [{
    skill: { type: String },
    level: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'EXPERT'], default: 'INTERMEDIATE' },
    yearsExp: { type: Number }
  }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
