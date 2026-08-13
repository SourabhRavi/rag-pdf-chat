const GuestUsage = require("../models/guest-usage.model");

const DAILY_CHAT_LIMIT = 10;

const guestUsageMiddleware = async (req, res, next) => {
  try {
    const guestId = req.guest.guestId;

    const today = new Date().toISOString().split("T")[0];

    const usage = await GuestUsage.findOne({
      guestId,
      date: today,
    });

    if (usage && usage.chatRequests >= DAILY_CHAT_LIMIT) {
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
