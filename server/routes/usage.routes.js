const express = require("express");
const guestMiddleware = require("../middleware/guest.middleware");
const GuestUsage = require("../models/guest-usage.model");
const USAGE_LIMITS = require("../config/usage-limits");
const router = express.Router();

router.get("/", guestMiddleware, async (req, res) => {
  const guestId = req.guest.guestId;
  const today = new Date().toISOString().split("T")[0];

  try {
    const usage = await GuestUsage.findOne({
      guestId,
      date: today,
    }).lean();

    return res.status(200).json({
      success: true,
      message: "Usage fetched successfully.",
      data: {
        used: usage?.chatRequests ?? 0,
        max_limit: USAGE_LIMITS.GUEST.MAX_DAILY_CHAT_REQUESTS,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to get usage.",
    });
  }
});

module.exports = router;
