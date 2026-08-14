import { api } from "@/services/api";
import type { ApiResponse } from "@/types/api.types";
import type {
  Conversation,
  ConversationResponse,
  ConversationsResponse,
} from "@/types/conversation.types";

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get<ApiResponse<ConversationsResponse>>("conversation");

  return data.data.conversation;
};

export const createConversation = async (): Promise<ConversationResponse> => {
  const { data } = await api.post<ApiResponse<ConversationResponse>>("conversation");

  return data.data;
};
