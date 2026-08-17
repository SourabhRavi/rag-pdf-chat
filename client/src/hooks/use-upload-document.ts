import type { ApiError } from "@/services/api-error";
import { uploadDocument } from "@/services/document.service";
import type { ApiResponse } from "@/types/api.types";
import type { DocumentResponse } from "@/types/document.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  //   useMutation<
  //   TData,      // successful result
  //   TError,     // error type
  //   TVariables  // what mutate() receives
  //   >

  return useMutation<ApiResponse<DocumentResponse>, ApiError, File>({
    mutationKey: ["upload"],
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
    },
  });
};
