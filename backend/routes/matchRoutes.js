const express = require("express");
const { param, body } = require("express-validator");
const router = express.Router();

const { matchFreelancer, getMatchHistory } = require("../controllers/matchController");
const { getApplicantsForGig, updateMatchStatus } = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");

router.get("/", protect, matchFreelancer);
router.get("/history", protect, getMatchHistory);
// GET applicants for a specific gig (client only; protect + authorize done in controller by ownership check)
router.get(
  '/gig/:gigId/applicants',
  protect,
  [param('gigId').isMongoId().withMessage('Invalid gig ID')],
  validate,
  getApplicantsForGig
);
// Update match status (accept/reject)
router.put(
  '/:matchId/status',
  protect,
  [
    param('matchId').isMongoId().withMessage('Invalid match ID'),
    body('status').isIn(['accepted','rejected','pending']).withMessage('Invalid status')
  ],
  validate,
  updateMatchStatus
);

module.exports = router;