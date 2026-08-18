const setGuestCookie = (res, guestId) => {
  res.cookie("guestId", guestId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
};

module.exports = setGuestCookie;
