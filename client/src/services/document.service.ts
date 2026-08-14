import { api } from "@/services/api";
import type { ApiResponse, UploadResponse } from "@/types/api.types";
import type { Document, DocumentsResponse } from "@/types/document.types";

export const getDocuments = async (): Promise<Document[]> => {
  const { data } = await api.get<ApiResponse<DocumentsResponse>>("document");

  return data.data.documents;
};

export const getDocument = async (documentId: string): Promise<ApiResponse<UploadResponse>> => {
  const { data } = await api.get(`document/${documentId}`);

  return data;
};
