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
