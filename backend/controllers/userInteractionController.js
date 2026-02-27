const UserInteraction = require("../models/UserInteraction");

exports.logInteraction = async (req, res) => {
  try {
    const { gigId, action } = req.body;
    if (!gigId || !["view", "apply", "click"].includes(action)) {
      return res.status(400).json({ message: "Invalid interaction payload" });
    }
    const interaction = await UserInteraction.create({
      user: req.user.id,
      gig: gigId,
      action
    });
    res.status(201).json({ message: "Logged", interaction });
  } catch (error) {
    console.error("LOG INTERACTION ERROR", error);
    res.status(500).json({ message: "Failed to log interaction" });
  }
};
