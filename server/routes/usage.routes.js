const express = require("express");
const guestMiddleware = require("../middleware/guest.middleware");
const GuestUsage = require("../models/guest-usage.model");
const guestUsageMiddleware = require("../middleware/guest-usage.middleware");
const router = express.Router();

router.get("/", guestMiddleware, guestUsageMiddleware, async (req, res) => {
  const { guestId, date } = req;

  try {
    const usage = await GuestUsage.findOne({
      guestId,
      date,
    }).lean();

    return res.status(200).json({
      success: true,
      message: "Usage fetched successfully.",
      data: {
        used: usage?.chatRequests ?? 0,
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
