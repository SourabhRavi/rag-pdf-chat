import { ArrowUp, CircleX, FileText } from "lucide-react";
import { useParams } from "react-router-dom";

import { Textarea } from "@/components/ui/textarea";
import { useDocuments } from "@/hooks/use-documents";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { useConversation } from "@/hooks/use-conversation";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatMessage, OptimisticChatMessage } from "@/types/chat-message.types";
import { streamChat } from "@/services/chat.service";
import { useQueryClient } from "@tanstack/react-query";

const DocumentChat = () => {
  const { conversationId } = useParams();

  const { data, isPending, isError, error } = useConversation(conversationId);

  const { data: documents = [] } = useDocuments();
  const { selectedDocumentIds, toggleDocumentSelection } = useDashboardWorkspace();

  const selectedDocuments = documents.filter((document) =>
    selectedDocumentIds.includes(document.documentId),
  );

  const [question, setQuestion] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const messageList = [...(data?.messages ?? []), ...optimisticMessages];

  const abortController = useRef<AbortController | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isError) {
      return;
    }
    toast.error(error instanceof Error ? error.message : "Failed to load conversation.");
  }, [isError, error]);

  const handleSend = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !conversationId || selectedDocumentIds.length === 0 || isStreaming) {
      return;
    }

    const controller = new AbortController();

    abortController.current = controller;

    setIsStreaming(true);
    setQuestion("");

    setOptimisticMessages([
      {
        role: "user",
        content: trimmedQuestion,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    try {
      await streamChat(
        {
          conversationId,
          documentIds: selectedDocumentIds,
          question: trimmedQuestion,
        },
        controller.signal,
        (event) => {
          console.log("Event: ", event);

          if (event.type === "token") {
            setOptimisticMessages((currentMessages) => {
              const assistantMessage = currentMessages[1];

              if (!assistantMessage) {
                return currentMessages;
              }

              return [
                currentMessages[0],
                {
                  ...assistantMessage,
                  content: assistantMessage.content + event.content,
                },
              ];
            });
          }
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
      setOptimisticMessages([]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      toast.error(error instanceof Error ? error.message : "Failed to send message.");
      setOptimisticMessages([]);
    } finally {
      abortController.current = null;
      setIsStreaming(false);
    }
  };

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-6 sm:pb-6 self-end">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-end gap-2 p-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="size-9 shrink-0 rounded-lg" />
            </div>

            <div className="flex items-center justify-between border-t px-3 py-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-sm font-semibold">Couldn't load this conversation</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading the conversation."}
          </p>
        </div>
      </div>
    );
  }

  // const { messages } = data; not used

  // message bubble
  const renderMessage = (message: ChatMessage | OptimisticChatMessage, key: string) => (
    <div
      key={key}
      className={
        message.role === "user"
          ? "ml-auto max-w-[80%] rounded-xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
          : "mr-auto max-w-[80%] rounded-xl bg-muted px-4 py-2.5 text-sm"
      }
    >
      {message.content}
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col w-full max-w-3xl px-3 sm:px-6">
      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {messageList.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Ask a question about your selected documents.
              </p>
            </div>
          ) : (
            <>
              {data.messages.map((message) => renderMessage(message, message.messageId))}

              {optimisticMessages.map((message, index) =>
                renderMessage(message, `optimisitic-${message.role}-${index}`),
              )}
            </>
          )}
        </div>
      </div>
      {/* Composer */}
      <div className="mx-auto w-full max-w-5xl pb-3 sm:pb-6 self-end">
        <div className="rounded-xl border bg-background shadow-sm">
          {/* selected documents */}
          {selectedDocuments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              {selectedDocuments.map((document) => (
                <div
                  key={document.documentId}
                  className="flex max-w-full items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1 text-xs"
                >
                  <FileText className="size-3.5 shrink-0 text-muted-foreground" />

                  <span className="max-w-40 truncate">{document.fileName}</span>

                  <button
                    type="button"
                    className="ml-0.5 rounded-sm text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${document.fileName}`}
                  >
                    <CircleX
                      className="size-3.5"
                      onClick={() => toggleDocumentSelection(document.documentId)}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 p-3">
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question about your documents..."
              className="min-h-10 max-h-32 w-full resize-none overflow-y-auto border-0 p-2 text-sm shadow-none focus-visible:ring-0 sm:text-base"
            />

            <button
              type="button"
              disabled={
                question.trim().length === 0 || selectedDocumentIds.length === 0 || isStreaming
              }
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              aria-label="Send message"
              onClick={handleSend}
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t px-3 py-2">
            <span className="text-xs text-muted-foreground">
              {selectedDocuments.length} of 3 documents selected
            </span>

            <span className="text-xs text-muted-foreground">Select documents to get started</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentChat;
