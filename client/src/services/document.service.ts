import { api } from "@/services/api";
import type { ApiResponse } from "@/types/api.types";
import type { AppDocument, DocumentResponse, DocumentsResponse } from "@/types/document.types";

export const getAllDocuments = async (): Promise<AppDocument[]> => {
  const { data } = await api.get<ApiResponse<DocumentsResponse>>("document");

  return data.data.documents;
};

export const getDocument = async (documentId: string): Promise<ApiResponse<DocumentResponse>> => {
  const { data } = await api.get(`document/${documentId}`);

  return data;
};

export const uploadDocument = async (file: File): Promise<ApiResponse<DocumentResponse>> => {
  const formData = new FormData();

  formData.append("pdf", file);

  const { data } = await api.post<ApiResponse<DocumentResponse>>("/document/upload", formData);

  return data;
};
