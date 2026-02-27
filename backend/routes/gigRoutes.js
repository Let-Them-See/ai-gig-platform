const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();

const {
  createGig,
  getGigs,
  getGigById,
  getRecruiterDashboard,
  getSkillGap
} = require("../controllers/gigController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");

// ================= CREATE GIG (Client Only) =================
router.post(
  "/",
  protect,
  authorizeRoles("client"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("skills").isArray().withMessage("Skills must be an array"),
    body("pay.amount").optional().isNumeric().withMessage("Pay amount must be numeric")
  ],
  validate,
  createGig
);

// ================= GET ALL GIGS =================
router.get("/", getGigs);

// ================= RECRUITER DASHBOARD =================
router.get("/dashboard", protect, authorizeRoles("client"), getRecruiterDashboard);

// ================= FREELANCER DASHBOARD (View available gigs) =================
router.get("/freelancer-dashboard", protect, authorizeRoles("freelancer"), getGigs);

// ================= GET SINGLE GIG BY ID =================
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid gig ID")],
  validate,
  getGigById
);

// ================= SKILL GAP FOR A GIVEN GIG (freelancer or client) =================
router.get(
  "/:id/skill-gap",
  protect,
  [param("id").isMongoId().withMessage("Invalid gig ID")],
  validate,
  getSkillGap
);

// ================= FREELANCER DASHBOARD (View available gigs) =================
router.get("/freelancer-dashboard", protect, authorizeRoles("freelancer"), getGigs);

module.exports = router;