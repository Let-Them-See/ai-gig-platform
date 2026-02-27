const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateSkills,
  updateProfile,
  refreshToken,
  logout
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars")
  ],
  validate,
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  validate,
  loginUser
);

// issue a fresh access token using httpOnly refresh cookie
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.put("/skills", protect, updateSkills);
router.put("/update-profile", protect, updateProfile);

module.exports = router;