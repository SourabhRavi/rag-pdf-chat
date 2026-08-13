const mongoose = require("mongoose");

const guestUsageSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    chatRequests: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

guestUsageSchema.index(
  {
    guestId: 1,
    date: 1,
  },
  { unique: true },
);

const GuestUsage = mongoose.model("GuestUsage", guestUsageSchema);

module.exports = GuestUsage;
