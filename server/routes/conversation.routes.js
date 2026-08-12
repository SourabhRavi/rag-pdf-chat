const express = require("express");
const { randomUUID } = require("crypto");

const Conversation = require("../models/conversation.model");
const guestMiddleware = require("../middleware/guest.middleware");
const ChatMessage = require("../models/chat-message.model");

const router = express.Router();

router.post("/", guestMiddleware, async (req, res) => {
  try {
    const guestId = req.guest.guestId;

    const conversationId = randomUUID();

    const conversation = await Conversation.create({
      conversationId,
      guestId,
      title: "New Chat",
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      data: {
        conversationId: conversation.conversationId,
        title: conversation.title,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to create conversation.",
    });
  }
});

router.get("/:conversationId", guestMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const guestId = req.guest.guestId;

    const conversation = await Conversation.findOne({
      conversationId,
      guestId,
    }).lean();

    if (!conversation) {
      return res.status(200).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const messages = await ChatMessage.find({
      conversationId,
      guestId,
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully.",
      data: {
        conversation,
        messages,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversation.",
    });
  }
});

module.exports = router;
