const { getOrCreateGuest } = require("../services/guest.service");
const setGuestCookie = require("../utils/guest-cookie");

require("dotenv").config();

const guestMiddleware = async (req, res, next) => {
  try {
    const guestId = req.cookies.guestId;

    const guest = await getOrCreateGuest(guestId);
    req.guest = guest;

    if (!guestId || guest.guestId !== guestId) {
      setGuestCookie(res, guest.guestId);
    }

    next();
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to establish guest session.",
    });
  }
};

module.exports = guestMiddleware;
