const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { 
      type: String, 
      enum: ["freelancer", "client", "admin"], 
      default: "freelancer" 
    },

    skills: [{ type: String }],

    resumeText: { type: String },

    location: { type: String },

    expectedPay: { type: Number },   // 👈 NEW

    // cached embedding vector for the resume text
    resumeEmbedding: { type: [Number], default: [] }
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);