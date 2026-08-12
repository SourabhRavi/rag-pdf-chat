const express = require("express");

const { createEmbedding, ai } = require("../services/gemini.service");
const qdrantClient = require("../services/qdrant.service");

const router = express.Router();

const guestMiddleware = require("../middleware/guest.middleware");
const Conversation = require("../models/conversation.model");
const ChatMessage = require("../models/chat-message.model");

const { randomUUID } = require("crypto");
const Document = require("../models/document.model");

router.post("/", guestMiddleware, async (req, res) => {
  try {
    const { conversationId, question, documentIds } = req.body;
    const guestId = req.guest.guestId;

    if (
      !conversationId ||
      !question?.trim() ||
      !Array.isArray(documentIds) ||
      documentIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "conversationId, question and documentIds are required.",
      });
    }

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
      limit: 1,
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

    if (searchResult.points.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching document content found.",
      });
    }

    const bestChunk = searchResult.points[0].payload.text;

    await ChatMessage.create({
      messageId: randomUUID(),
      conversationId,
      guestId,
      role: "user",
      content: question.trim(),
      documentIds,
    });

    // for content streaming
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash-lite",
      contents: `Explain the question using the context: ${bestChunk} and question is: ${question}`,
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let assistantMessage = "";

    for await (const chunk of responseStream) {
      const text = chunk.text;

      assistantMessage += text;

      res.write(text);
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
