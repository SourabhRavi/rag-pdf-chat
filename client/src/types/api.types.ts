export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UploadResponse {
  documentId: string;
  fileName: string;
}
