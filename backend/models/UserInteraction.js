const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig"
    },
    action: {
      type: String,
      enum: ["view", "apply", "click"],
      required: true
    }
  },
  { timestamps: { createdAt: "timestamp" } }
);

module.exports = mongoose.model("UserInteraction", interactionSchema);
