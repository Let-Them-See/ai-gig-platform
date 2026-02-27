const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

// load environment variables early
dotenv.config();

// connect to database
connectDB();

const app = express();

// --- Middlewares ---
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(rateLimiter); // global rate limiting

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// versioned APIs
const API_PREFIX = "/api/v1";

// route modules
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const matchRoutes = require("./routes/matchRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interactionRoutes = require("./routes/interactionRoutes");

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/gigs`, gigRoutes);
app.use(`${API_PREFIX}/match`, matchRoutes);
app.use(`${API_PREFIX}/resume`, resumeRoutes);
app.use(`${API_PREFIX}/applications`, applicationRoutes);
app.use(`${API_PREFIX}/interactions`, interactionRoutes);

app.get("/", (req, res) => {
  res.send("AI Gig Matching API Running...");
});

// generic protected test route
app.get(`${API_PREFIX}/protected`, require("./middleware/authMiddleware").protect, (req, res) => {
  res.json({ message: "You accessed protected route", user: req.user });
});

// centralized error handler (should be last middleware)
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
