const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String },
    skills: [{ type: String }],
    location: { type: String },
    experienceLevel: { type: String },
    pay: {
      type: { type: String },
      amount: { type: Number }
    },
    category: { type: String },
    underservedFocus: { type: String },

    // store embedding vector for the gig description/skills to speed up matching
    embedding: { type: [Number], default: [] },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // For platform-seeded gigs (e.g. from external APIs like JSearch),
      // there may be no specific user owner, so this is optional.
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gig", gigSchema);
