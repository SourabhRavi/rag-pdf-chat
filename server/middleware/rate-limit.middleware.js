const { rateLimit } = require("express-rate-limit");

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: {
    success: false,
    message: "Too many chat requests. Please try again after a minute.",
  },
});

module.exports = chatRateLimiter;
