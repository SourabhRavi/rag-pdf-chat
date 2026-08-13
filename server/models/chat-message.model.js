const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
  guestId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  documentIds: {
    type: [String],
    default: undefined,
  },
});

chatMessageSchema.index({
  conversationId: 1,
  createdAt: 1,
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
