export interface Document {
  documentId: string;
  fileName: string;
  uploadedAt: string;
}

export interface DocumentsResponse {
  documents: Document[];
}
