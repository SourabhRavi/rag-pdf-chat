export interface AppDocument {
  documentId: string;
  fileName: string;
  uploadedAt: string;
}

export interface DocumentsResponse {
  documents: AppDocument[];
}

export interface DocumentResponse {
  fileName: string;
  documentId: string;
}
