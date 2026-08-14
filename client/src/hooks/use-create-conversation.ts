import { createConversation } from "@/services/conversation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
