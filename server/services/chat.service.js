const { CHAT_EVENTS, CHAT_STATUS, CHAT_ERROR_CODES } = require("../constants/chat.constants");
const ChatMessage = require("../models/chat-message.model");
const Conversation = require("../models/conversation.model");
const Document = require("../models/document.model");
const GuestUsage = require("../models/guest-usage.model");
const { sendSSE } = require("../utils/sse");
const { createEmbedding, ai } = require("./gemini.service");
const qdrantClient = require("./qdrant.service");

const { randomUUID } = require("crypto");

const streamChat = async ({ res, date, guestId, conversationId, documentIds, question }) => {
  const TOP_K = 5;
  const MIN_SCORE = 0.5;

  const conversation = await Conversation.findOne({
    guestId,
    conversationId,
  });

  if (!conversation) {
    return {
      success: false,
      status: 404,
      code: CHAT_ERROR_CODES.CONVERSATION_NOT_FOUND,
      message: "Conversation not found.",
    };
  }

  const document = await Document.find({
    guestId,
    documentId: {
      $in: documentIds,
    },
  }).lean();

  if (document.length !== documentIds.length) {
    return {
      success: false,
      status: 403,
      code: CHAT_ERROR_CODES.DOCUMENT_ACCESS_DENIED,
      message: "One or more selected documents are not accessible.",
    };
  }

  sendSSE(res, CHAT_EVENTS.STATUS, {
    status: CHAT_STATUS.SEARCHING,
  });

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
    return {
      success: false,
      status: 404,
      code: CHAT_ERROR_CODES.NO_RELEVANT_CONTENT,
      message: "No sufficiently relevant content found.",
    };
  }

  const context = relevantPoints.map((point) => point.payload.text).join("\n\n---\n\n");

  sendSSE(res, CHAT_EVENTS.SOURCES, {
    sources: relevantPoints.map((point) => ({
      documentId: point.payload.documentId,
      fileName: point.payload.fileName,
      chunkIndex: point.payload.chunkIndex,
    })),
  });

  await ChatMessage.create({
    messageId: randomUUID(),
    conversationId: conversationId,
    guestId: guestId,
    role: "user",
    content: question.trim(),
    documentIds,
  });

  if (conversation.title === "New Chat") {
    const title = question.trim().length > 50 ? `${question.trim().slice(0, 50)}` : question;

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

  sendSSE(res, CHAT_EVENTS.STATUS, {
    status: CHAT_STATUS.GENERATING,
  });

  const responseStream = await ai.models.generateContentStream({
    model: "gemini-3.5-flash-lite",
    contents: `Answer the user's question using only the provided context.
                  Context:
                  ${context}
                  
                  Question:
                  ${question}`,
  });

  let assistantMessage = "";

  for await (const chunk of responseStream) {
    const text = chunk.text || "";

    if (!text) {
      continue;
    }

    assistantMessage += text;

    sendSSE(res, CHAT_EVENTS.TOKEN, {
      content: text,
    });
  }

  const messageId = randomUUID();

  await ChatMessage.create({
    guestId,
    messageId,
    conversationId,
    role: "assistant",
    content: assistantMessage,
  });

  await GuestUsage.findOneAndUpdate(
    {
      guestId,
      date,
    },
    {
      $inc: {
        chatRequests: 1,
      },
    },
    { upsert: true },
  );

  sendSSE(res, CHAT_EVENTS.DONE, {
    messageId,
  });

  return {
    success: true,
  };
};

module.exports = { streamChat };
