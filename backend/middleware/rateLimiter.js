const rateLimit = require("express-rate-limit");

// simple global limiter - 100 requests per 15 minutes per IP
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later"
});