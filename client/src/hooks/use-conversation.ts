import { getConversation } from "@/services/conversation.service";
import { useQuery } from "@tanstack/react-query";

export const useConversation = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId!),
    enabled: !!conversationId,
  });
};
