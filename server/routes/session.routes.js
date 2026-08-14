const express = require("express");

const { getOrCreateGuest } = require("../services/guest.service");
const setGuestCookie = require("../utils/guest-cookie");

const router = express.Router();

const guestMiddleware = require("../middleware/guest.middleware");

router.get("/", guestMiddleware, async (req, res) => {
  try {
    let guestId = req.cookies.guestId;
    let guest = await getOrCreateGuest(guestId);

    if (!guestId || guest.guestId !== guestId) {
      setGuestCookie(res, guest.guestId);
    }

    return res.status(200).json({
      success: true,
      message: "Guest session ready",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to create guest session.",
    });
  }
});

module.exports = router;
