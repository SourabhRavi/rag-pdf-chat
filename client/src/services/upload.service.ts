import { api } from "@/services/api";
import type { ApiResponse, UploadResponse } from "@/types/api.types";

export const uploadPdf = async (file: File): Promise<ApiResponse<UploadResponse>> => {
  const formData = new FormData();

  formData.append("pdf", file);

  const { data } = await api.post<ApiResponse<UploadResponse>>("/upload", formData);

  return data;
};
