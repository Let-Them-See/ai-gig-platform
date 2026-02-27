const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "accepted"],
      default: "applied"
    },
    matchScore: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// create a unique compound index so a freelancer can't apply twice
applicationSchema.index({ freelancer: 1, gig: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
