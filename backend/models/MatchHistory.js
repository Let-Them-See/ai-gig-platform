const mongoose = require("mongoose");

const matchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true
    },

    matchPercentage: {
      type: Number,
      required: true
    },

    skillMatchScore: Number,
    semanticContribution: Number,
    locationScore: Number,
    salaryScore: Number,

    matchedSkills: [String]
    ,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MatchHistory", matchHistorySchema);