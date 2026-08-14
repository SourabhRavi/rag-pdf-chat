import { getConversations } from "@/services/conversation.service";
import { useQuery } from "@tanstack/react-query";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
};
