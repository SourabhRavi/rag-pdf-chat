const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Guest = mongoose.model("Guest", guestSchema);

module.exports = Guest;
