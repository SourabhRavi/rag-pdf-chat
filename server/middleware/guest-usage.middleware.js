const USAGE_LIMITS = require("../config/usage-limits");
const GuestUsage = require("../models/guest-usage.model");

const guestUsageMiddleware = async (req, res, next) => {
  try {
    const guestId = req.guest.guestId;

    const today = new Date().toISOString().split("T")[0];

    const usage = await GuestUsage.findOne({
      guestId,
      date: today,
    });

    if (usage && usage.chatRequests >= USAGE_LIMITS.GUEST.MAX_DAILY_CHAT_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Daily chat limit reached. Please try again tomorrow.",
      });
    }

    req.guestUsage = {
      guestId,
      date: today,
    };

    next();
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to check guest usage.",
    });
  }
};

module.exports = guestUsageMiddleware;
