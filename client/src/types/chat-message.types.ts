export interface ChatMessage {
  messageId: string;
  conversationId: string;
  guestId: string;
  role: "user" | "assistant";
  content: string;
  documentIds: string[];
}
