const express = require("express");
const { randomUUID } = require("crypto");

require("dotenv").config();

const Guest = require("../models/guest.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let guestId = req.cookies.guestId;
    let guest = null;

    if (guestId) {
      guest = await Guest.findOne({ guestId });
    }

    if (!guest) {
      guestId = randomUUID();

      await Guest.create({
        guestId,
      });

      res.cookie("guestId", guestId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Guest session ready",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create guest session.",
    });
  }
});

module.exports = router;
