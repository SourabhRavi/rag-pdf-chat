const setGuestCookie = (res, guestId) => {
  res.cookie("guestId", guestId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

module.exports = setGuestCookie;
