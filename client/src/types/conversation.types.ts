import type { ChatMessage } from "@/types/chat-message.types";

export interface Conversation {
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsResponse {
  conversation: Conversation[];
}

export interface ConversationResponse {
  conversationId: string;
  title: string;
}

export interface ConversationDetailsResponse {
  conversation: Conversation;
  messages: ChatMessage[];
}
