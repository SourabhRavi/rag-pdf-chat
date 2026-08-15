const express = require("express");

const router = express.Router();

const guestMiddleware = require("../middleware/guest.middleware");
const { chatSchema } = require("../validators/chat.validator");
const chatRateLimiter = require("../middleware/rate-limit.middleware");
const guestUsageMiddleware = require("../middleware/guest-usage.middleware");
const { streamChat } = require("../services/chat.service");
const { setupSSE, sendSSE } = require("../utils/sse");
const { CHAT_EVENTS, CHAT_ERROR_CODES } = require("../constants/chat.constants");

const { randomUUID } = require("crypto");

router.post("/", chatRateLimiter, guestMiddleware, guestUsageMiddleware, async (req, res) => {
  // const guestId = req.guest.guestId;
  const { guestId, date } = req.guestUsage;

  const result = chatSchema.safeParse(req.body);

  const requestId = randomUUID();

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid chat request.",
      errors: result.error.flatten().fieldErrors,
      requestId,
    });
  }

  const { conversationId, documentIds, question } = result.data;

  try {
    setupSSE(res);

    const result = await streamChat({
      req,
      res,
      requestId,
      date,
      guestId,
      conversationId,
      documentIds,
      question,
    });

    if (!result.success) {
      sendSSE(res, CHAT_EVENTS.ERROR, {
        code: result.code ?? CHAT_ERROR_CODES.CHAT_FAILED,
        message: result.message,
        requestId,
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
        requestId,
      });

      return res.end();
    }

    return res.status(500).json({
      success: false,
      message: "Failed to process chat.",
      requestId,
    });
  }
});

module.exports = router;
