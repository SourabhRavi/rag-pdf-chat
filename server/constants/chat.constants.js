const CHAT_STATUS = Object.freeze({
  SEARCHING: "searching",
  GENERATING: "generating",
});

const CHAT_EVENTS = Object.freeze({
  STATUS: "status",
  SOURCES: "sources",
  TOKEN: "token",
  DONE: "done",
  ERROR: "error",
});

const CHAT_ERROR_CODES = Object.freeze({
  CONVERSATION_NOT_FOUND: "CONVERSATION_NOT_FOUND",
  DOCUMENT_ACCESS_DENIED: "DOCUMENT_ACCESS_DENIED",
  NO_RELEVANT_CONTENT: "NO_RELEVANT_CONTENT",
  GENERATION_FAILED: "GENERATION_FAILED",
  CHAT_FAILED: "CHAT_FAILED",
});

module.exports = {
  CHAT_STATUS,
  CHAT_EVENTS,
  CHAT_ERROR_CODES,
};
