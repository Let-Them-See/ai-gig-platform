const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { logInteraction } = require("../controllers/userInteractionController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");

// all authenticated users can log interactions
router.post(
  "/",
  protect,
  [
    body("gigId").optional().isMongoId().withMessage("Invalid gig ID"),
    body("action").isIn(["view", "apply", "click"]).withMessage("Invalid action")
  ],
  validate,
  logInteraction
);

module.exports = router;
