export interface SendMessageRequest {
  conversationId: string;
  documentIds: string[];
  question: string;
}

export interface ChatSource {
  documentId: string;
  fileName: string;
  uploadedAt?: string;
}

export type ChatStatus = "searching" | "generating";

export type ChatStreamEvent =
  | {
      type: "status";
      status: ChatStatus;
    }
  | {
      type: "sources";
      sources: ChatSource[];
    }
  | {
      type: "token";
      content: string;
    }
  | {
      type: "done";
      messageId: string;
    }
  | {
      type: "error";
      code: string;
      message: string;
      requestId?: string;
    };
