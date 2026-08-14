import { api } from "@/services/api";
import type { ApiResponse } from "@/types/api.types";
import type { Conversation, ConversationsResponse } from "@/types/conversation.types";

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get<ApiResponse<ConversationsResponse>>("conversation");

  return data.data.conversation;
};
