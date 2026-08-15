const express = require("express");

const router = express.Router();

const guestMiddleware = require("../middleware/guest.middleware");
const { chatSchema } = require("../validators/chat.validator");
const chatRateLimiter = require("../middleware/rate-limit.middleware");
const guestUsageMiddleware = require("../middleware/guest-usage.middleware");
const { streamChat } = require("../services/chat.service");
const { setupSSE, sendSSE } = require("../utils/sse");
const { CHAT_EVENTS, CHAT_ERROR_CODES } = require("../constants/chat.constants");

router.post("/", chatRateLimiter, guestMiddleware, guestUsageMiddleware, async (req, res) => {
  // const guestId = req.guest.guestId;
  const { guestId, date } = req.guestUsage;

  const result = chatSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid chat request.",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { conversationId, documentIds, question } = result.data;

  try {
    setupSSE(res);

    const result = await streamChat({
      res,
      date,
      guestId,
      conversationId,
      documentIds,
      question,
    });

    if (!result.success) {
      sendSSE(res, CHAT_EVENTS.ERROR, {
        status: result.status,
        code: result.code ?? CHAT_ERROR_CODES.CHAT_FAILED,
        message: result.message,
      });

      return res.end();
    }

    return res.end();
  } catch (err) {
    console.error(err);

    if (res.headersSent) {
      sendSSE(res, CHAT_EVENTS.ERROR, {
        code: CHAT_ERROR_CODES.CHAT_FAILED,
        message: "Failed to process chat.",
      });

      return res.end();
    }

    return res.status(500).json({
      success: false,
      message: "Failed to process chat.",
    });
  }
});

module.exports = router;
