const { randomUUID } = require("crypto");
const Guest = require("../models/guest.model");

const getOrCreateGuest = async (guestId) => {
  if (guestId) {
    const guest = await Guest.findOne({ guestId });

    if (guest) {
      return guest;
    }
  }

  const newGuestId = randomUUID();

  const guest = await Guest.create({
    guestId: newGuestId,
  });

  return guest;
};

module.exports = {
  getOrCreateGuest,
};
