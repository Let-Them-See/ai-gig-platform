const express = require("express");
const { param, body } = require("express-validator");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");

// freelancers apply to a gig
router.post(
  "/apply/:gigId",
  protect,
  authorizeRoles("freelancer"),
  [param("gigId").isMongoId().withMessage("Invalid gig ID")],
  validate,
  applicationController.applyToGig
);

// freelancer views own applications
router.get(
  "/my",
  protect,
  authorizeRoles("freelancer"),
  applicationController.getMyApplications
);

// client views applications for a specific gig
router.get(
  "/gig/:gigId",
  protect,
  authorizeRoles("client"),
  applicationController.getApplicationsForGig
);

// client updates application status
router.patch(
  "/:applicationId/status",
  protect,
  authorizeRoles("client"),
  [
    param("applicationId").isMongoId().withMessage("Invalid application ID"),
    body("status").isIn(["applied","shortlisted","rejected","accepted"]).withMessage("Invalid status")
  ],
  validate,
  applicationController.updateApplicationStatus
);

module.exports = router;
