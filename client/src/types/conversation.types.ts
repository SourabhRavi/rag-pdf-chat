export interface Conversation {
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsResponse {
  conversation: Conversation[];
}
