import { api } from "@/services/api";
import type { ApiResponse, UploadResponse } from "@/types/api.types";

export const getDocument = async (documentId: string): Promise<ApiResponse<UploadResponse>> => {
  const { data } = await api.get(`document/${documentId}`);

  return data;
};
