const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume } = require("../controllers/resumeController");

router.post("/", protect, upload.single("resume"), uploadResume);

module.exports = router;