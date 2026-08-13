const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
    },
    guestId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  guestId: 1,
  updatedAt: -1,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
