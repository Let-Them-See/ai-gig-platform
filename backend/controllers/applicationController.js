const Application = require("../models/Application");
const Gig = require("../models/Gig");
const User = require("../models/User");
const matchService = require("../services/matchService");

// freelancer applies to a gig
exports.applyToGig = async (req, res) => {
  try {
    // only freelancers allowed by route guard
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // prevent duplicates (index on schema also helps)
    const existing = await Application.findOne({ freelancer: user._id, gig: gig._id });
    if (existing) {
      return res.status(400).json({ message: "You have already applied to this gig" });
    }

    const scoreObj = await matchService.computeMatch(user, gig);

    const application = await Application.create({
      freelancer: user._id,
      gig: gig._id,
      matchScore: scoreObj.matchPercentage
    });

    // optionally we could log an "apply" interaction
    const UserInteraction = require("../models/UserInteraction");
    UserInteraction.create({ user: user._id, gig: gig._id, action: "apply" }).catch(() => {});

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    console.error("APPLY ERROR:", error);
    res.status(500).json({ message: "Failed to apply", error: error.message });
  }
};

// freelancers view their own applications
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ freelancer: req.user.id })
      .populate("gig")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// client views applications for a gig they own
exports.getApplicationsForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (String(gig.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const apps = await Application.find({ gig: gig._id })
      .populate("freelancer", "name email skills resumeText")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// client updates status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    if (!["applied", "shortlisted", "rejected", "accepted"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const app = await Application.findById(applicationId).populate("gig");
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.gig.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    app.status = status;
    await app.save();
    res.json({ message: "Status updated", application: app });
  } catch (error) {
    console.error("UPDATE APPLICATION STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};
