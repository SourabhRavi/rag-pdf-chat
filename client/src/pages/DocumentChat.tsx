import { ArrowUp, Check, ChevronDown, ChevronUp, CircleX, Copy, FileText } from "lucide-react";
import { useParams } from "react-router-dom";

import { Textarea } from "@/components/ui/textarea";
import { useDocuments } from "@/hooks/use-documents";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { useConversation } from "@/hooks/use-conversation";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatMessage, OptimisticChatMessage } from "@/types/chat-message.types";
import { streamChat } from "@/services/chat.service";
import { useQueryClient } from "@tanstack/react-query";
// import type { ChatSource } from "@/types/chat.types";
import { StreamingStatus } from "@/components/chat/chat-status";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Badge } from "@/components/ui/badge";
import ConversationEmpty from "@/components/conversations/conversation-empty";
import { cn } from "@/lib/utils";

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

  const [status, setStatus] = useState<string | null>(null);
  // const [sources, setSources] = useState<ChatSource[]>([]);

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const messageList = useMemo(
    () => [...(data?.messages ?? []), ...optimisticMessages],
    [data?.messages, optimisticMessages],
  );

  const abortController = useRef<AbortController | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isError) {
      return;
    }
    toast.error(error instanceof Error ? error.message : "Failed to load conversation.");
  }, [isError, error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messageList]);

  const handleSend = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !conversationId || selectedDocumentIds.length === 0 || isStreaming) {
      return;
    }

    const controller = new AbortController();

    abortController.current = controller;

    setIsStreaming(true);
    setStatus(null);
    // setSources([]);
    setQuestion("");

    setOptimisticMessages([
      {
        role: "user",
        content: trimmedQuestion,
        failed: false,
      },
      {
        role: "assistant",
        content: "",
        failed: false,
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
        async (event) => {
          console.log("Event:", event);

          switch (event.type) {
            case "status":
              setStatus(event.status);
              break;

            // case "sources":
            //   setSources(event.sources);
            //   break;

            case "token":
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
              break;

            case "done":
              setStatus(null);
              await queryClient.invalidateQueries({
                queryKey: ["usage"],
              });
              break;

            case "error":
              toast.error(event?.message ?? "Failed to send message.");
              throw new Error(event.message);
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

      // set failed state of optimistic message true if there is an error
      setOptimisticMessages((currentOptimisticMessages) => {
        return currentOptimisticMessages.map((message) => ({ ...message, failed: true }));
      });
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

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedMessageId(messageId);

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch {
      toast.error("Failed to copy message.");
    }
  };

  // message bubble
  const renderMessage = (
    message: ChatMessage | OptimisticChatMessage,
    key: string,
    isOptimistic = false,
  ) => {
    const isUser = message.role === "user";
    const isCopied = copiedMessageId === key;

    return (
      <div
        key={key}
        className={
          isUser ? "ml-auto max-w-[80%] flex flex-col items-end" : "mr-auto w-full max-w-[85%]"
        }
      >
        <Bubble
          align={isUser ? "end" : "start"}
          variant={
            isUser
              ? // check if message.failed is true or false and apply styling
                isOptimistic && "failed" in message && message.failed
                ? "destructive"
                : "tinted"
              : "ghost"
          }
          className={isUser ? "max-w-full" : "max-w-[37em]"}
        >
          <BubbleContent className="px-0 pb-0">
            {isUser ? (
              <div>
                <div
                  className={cn(
                    "whitespace-pre-wrap px-2 pb-2",
                    !expandedMessages.has(key) &&
                      "max-h-40 overflow-y-auto scroll-fade scroll-fade-18",
                  )}
                >
                  {/* {message.content} */}
                  <div className="typeset typeset-chat px-2 text-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                </div>
                {message.content.length > 600 && (
                  <button
                    onClick={() =>
                      setExpandedMessages((prev) => {
                        const next = new Set(prev);

                        if (next.has(key)) {
                          next.delete(key);
                        } else {
                          next.add(key);
                        }

                        return next;
                      })
                    }
                    className="inline-flex items-center gap-1 w-full py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer px-3"
                  >
                    {expandedMessages.has(key) ? "Show less" : "Show more"}
                    {expandedMessages.has(key) ? (
                      <ChevronUp className="size-4 text-muted-foreground" strokeWidth={2} />
                    ) : (
                      <ChevronDown className="size-5 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
            ) : (
              <>
                {message.content ? (
                  <div className="typeset typeset-chat px-2 text-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  isOptimistic && <StreamingStatus status={status} />
                )}
              </>
            )}
          </BubbleContent>
        </Bubble>

        {isOptimistic &&
          message.content &&
          message.role === "user" &&
          "failed" in message &&
          message.failed && (
            <div className="mt-1 flex items-center text-xs text-muted-foreground italic">
              Couldn't send message.
            </div>
          )}

        {message.content && message.role === "assistant" && (
          <div className="mt-2 flex items-center">
            <button
              type="button"
              onClick={() => handleCopy(message.content, key)}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
              aria-label={isCopied ? "Copied" : "Copy message"}
            >
              {isCopied ? (
                <>
                  <Check className="size-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col px-6 xl:px-5">
      {/* Messages */}
      <div className="min-h-0 flex flex-1 overflow-y-auto py-6 scrollbar-none">
        <div className="mx-auto flex w-full max-w-2xl lg:max-w-3xl flex-col gap-4">
          {messageList.length === 0 ? (
            <ConversationEmpty />
          ) : (
            <>
              {data.messages.map((message) => renderMessage(message, message.messageId))}

              {optimisticMessages.map((message, index) =>
                renderMessage(message, `optimistic-${message.role}-${index}`, true),
              )}
            </>
          )}

          {/* Space reserved for fixed composer */}
          <div className="h-52 shrink-0" />

          {/* ref for scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Composer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="pointer-events-auto mx-auto w-full">
          <div className="rounded-2xl border bg-background shadow-sm w-full max-w-3xl mx-auto">
            {/* Selected documents */}
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              {selectedDocuments.length > 0 ? (
                selectedDocuments.map((document) => (
                  <Badge className="rounded-sm bg-primary/15 dark:bg-primary/70 text-muted-foreground dark:text-foreground/70 hover:bg-primary/20 stroke-accent-foreground">
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />

                    <span className="max-w-40 truncate">{document.fileName}</span>

                    <button
                      type="button"
                      className="ml-0.5 rounded-sm text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${document.fileName}`}
                      onClick={() => toggleDocumentSelection(document.documentId)}
                    >
                      <CircleX className="size-3.5" />
                    </button>
                  </Badge>
                ))
              ) : (
                <Badge variant="destructive" className="rounded-sm">
                  No documents selected
                </Badge>
              )}
            </div>

            {/* Input */}
            <div className="flex items-end gap-2 p-3">
              <div className="flex justify-between items-end w-full bg-input/30 rounded-lg">
                <Textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask a question about your documents..."
                  className="min-h-10 max-h-32 w-full resize-none border-0 bg-transparent! p-2 text-sm shadow-none focus-visible:ring-0 sm:text-base scrollbar-none"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      if (selectedDocumentIds.length === 0) {
                        toast.warning("Select a document to chat.");
                      } else {
                        handleSend();
                      }
                    }
                  }}
                />
              </div>

              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={
                  question.trim().length === 0 || selectedDocumentIds.length === 0 || isStreaming
                }
                className="size-9 shrink-0 rounded-lg"
                aria-label="Send message"
              >
                <ArrowUp className="size-4" />
              </Button>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t px-3 py-2">
              <span className="text-xs text-muted-foreground">
                {selectedDocuments.length} of 3 documents selected
              </span>

              <span className="text-xs text-muted-foreground">Select documents to get started</span>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full flex justify-center">
          <div className="relative w-full max-w-3xl inset-x-0 bottom-0 -z-1 h-10 bg-background/90" />
        </div>
      </div>
    </div>
  );
};

export default DocumentChat;
