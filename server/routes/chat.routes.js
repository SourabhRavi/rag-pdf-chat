const express = require("express");

const { createEmbedding, ai } = require("../services/gemini.service");
const qdrantClient = require("../services/qdrant.service");

const router = express.Router();

const guestMiddleware = require("../middleware/guest.middleware");
const Conversation = require("../models/conversation.model");
const ChatMessage = require("../models/chat-message.model");

const { randomUUID } = require("crypto");
const Document = require("../models/document.model");

const { chatSchema } = require("../validators/chat.validator");
const chatRateLimiter = require("../middleware/rate-limit.middleware");

router.post("/", chatRateLimiter, guestMiddleware, async (req, res) => {
  const TOP_K = 5;
  const MIN_SCORE = 0.5;

  try {
    const guestId = req.guest.guestId;

    const result = chatSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat request.",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { conversationId, documentIds, question } = result.data;

    const conversation = await Conversation.findOne({
      conversationId,
      guestId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const documents = await Document.find({
      guestId,
      documentId: {
        $in: documentIds,
      },
    }).lean();

    if (documents.length !== documentIds.length) {
      return res.status(403).json({
        success: false,
        message: "One or more selected documents are not accessible.",
      });
    }

    const questionEmbedding = await createEmbedding(question);

    const searchResult = await qdrantClient.query("pdf-docs", {
      query: questionEmbedding,
      limit: TOP_K,
      with_payload: true,
      filter: {
        must: [
          {
            key: "guestId",
            match: {
              value: guestId,
            },
          },
          {
            key: "documentId",
            match: {
              any: documentIds,
            },
          },
        ],
      },
    });

    const relevantPoints = searchResult.points.filter((point) => point.score >= MIN_SCORE);

    if (relevantPoints.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sufficiently relevant content found.",
      });
    }

    // const bestChunk = searchResult.points[0].payload.text; // this is for limit: 1
    const context = relevantPoints.map((point) => point.payload.text).join("\n\n---\n\n");

    await ChatMessage.create({
      messageId: randomUUID(),
      conversationId,
      guestId,
      role: "user",
      content: question.trim(),
      documentIds,
    });

    if (conversation.title === "New Chat") {
      const title =
        question.trim().length > 50 ? `${question.trim().slice(0, 50)}...` : question.trim();

      await Conversation.updateOne(
        {
          guestId,
          conversationId,
        },
        {
          $set: {
            title,
          },
        },
      );
    }

    // for content streaming
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash-lite",
      contents: `Answer the user's question using only the provided context.
                  Context:
                  ${context}

                  Question:
                  ${question}`,
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let assistantMessage = "";

    try {
      for await (const chunk of responseStream) {
        const text = chunk.text || "";

        if (!text) {
          continue;
        }

        assistantMessage += text;

        res.write(text);
      }
    } catch (err) {
      console.error("Gemini streaming error:", err);

      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: "Failed to generate response.",
        });
      }

      res.end();
      return;
    }

    await ChatMessage.create({
      messageId: randomUUID(),
      conversationId,
      guestId,
      role: "assistant",
      content: assistantMessage,
    });

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to process chat.",
    });
  }
});

module.exports = router;
