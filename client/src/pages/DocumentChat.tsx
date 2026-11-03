import { ArrowUp, Check, CircleX, Copy, FileText, LockKeyhole, MessageSquareText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useDocuments } from "@/hooks/use-documents";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { useConversation } from "@/hooks/use-conversation";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, OptimisticChatMessage } from "@/types/chat-message.types";
import { streamChat } from "@/services/chat.service";
import { useQueryClient } from "@tanstack/react-query";
import { StreamingStatus } from "@/components/chat/chat-status";
import { Button } from "@/components/ui/button";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import ConversationEmpty from "@/components/conversations/conversation-empty";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExpandableMessage } from "@/components/chat/chat-message-expandable";
import DocumentChatSkeleton from "@/components/skeletons/document-chat-skeleton";
import Logo from "@/assets/logo/skim-logo-svg.svg?react";

const DocumentChat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useConversation(conversationId);
  const { data: documents = [] } = useDocuments();
  const { selectedDocumentIds, deselectDocument } = useDashboardWorkspace();

  const selectedDocuments = documents.filter((document) => selectedDocumentIds.includes(document.documentId));
  const [question, setQuestion] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messageList = useMemo(() => [...(data?.messages ?? []), ...optimisticMessages], [data?.messages, optimisticMessages]);
  const abortController = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isError) toast.error(error instanceof Error ? error.message : "Failed to load conversation.");
  }, [isError, error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messageList]);

  useEffect(() => () => abortController.current?.abort(), []);

  const handleSend = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || !conversationId || selectedDocumentIds.length === 0 || isStreaming) return;

    const controller = new AbortController();
    abortController.current = controller;
    setIsStreaming(true);
    setStatus(null);
    setQuestion("");
    setOptimisticMessages([
      { role: "user", content: trimmedQuestion, failed: false },
      { role: "assistant", content: "", failed: false },
    ]);

    try {
      await streamChat(
        { conversationId, documentIds: selectedDocumentIds, question: trimmedQuestion },
        controller.signal,
        async (event) => {
          switch (event.type) {
            case "status":
              setStatus(event.status);
              break;
            case "token":
              setOptimisticMessages((currentMessages) => {
                const assistantMessage = currentMessages[1];
                if (!assistantMessage) return currentMessages;
                return [currentMessages[0], { ...assistantMessage, content: assistantMessage.content + event.content }];
              });
              break;
            case "done":
              setStatus(null);
              await queryClient.invalidateQueries({ queryKey: ["usage"] });
              break;
            case "error":
              toast.error(event?.message ?? "Failed to send message.");
              throw new Error(event.message);
          }
        },
      );

      await queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
      setOptimisticMessages([]);
    } catch (streamError) {
      if (streamError instanceof DOMException && streamError.name === "AbortError") return;
      toast.error(streamError instanceof Error ? streamError.message : "Failed to send message.");
      setOptimisticMessages((current) => current.map((message) => ({ ...message, failed: true })));
    } finally {
      abortController.current = null;
      setIsStreaming(false);
    }
  };

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      window.setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      toast.error("Failed to copy message.");
    }
  };

  const renderMessage = (message: ChatMessage | OptimisticChatMessage, key: string, isOptimistic = false) => {
    const isUser = message.role === "user";
    const isCopied = copiedMessageId === key;

    return (
      <div key={key} className={"skim-chat-message " + (isUser ? "skim-chat-message-user" : "skim-chat-message-assistant")} data-role={message.role}>
        <div className="skim-message-author">
          {isUser ? (
            <><span className="flex size-[22px] items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">Y</span><span>You</span></>
          ) : (
            <><span className="skim-assistant-mark"><Logo /></span><span>Skim</span><span className="font-normal text-muted-foreground/65">AI assistant</span></>
          )}
        </div>

        <Bubble
          align={isUser ? "end" : "start"}
          variant={isUser ? isOptimistic && "failed" in message && message.failed ? "destructive" : "tinted" : "ghost"}
          className={isUser ? "skim-user-bubble" : "skim-assistant-bubble"}
        >
          <BubbleContent className={isUser ? "px-0 pb-0" : "px-0 pb-0"}>
            {isUser ? (
              <ExpandableMessage content={message.content} />
            ) : (
              message.content ? (
                <div className="typeset typeset-chat px-1 text-foreground">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                </div>
              ) : (
                isOptimistic && <StreamingStatus status={status} />
              )
            )}
          </BubbleContent>
        </Bubble>

        {isOptimistic && message.content && isUser && "failed" in message && message.failed && (
          <div className="text-[10px] italic text-destructive">Couldn't send message.</div>
        )}

        {message.content && message.role === "assistant" && (
          <button type="button" onClick={() => handleCopy(message.content, key)} className="skim-chat-copy" aria-label={isCopied ? "Copied" : "Copy message"}>
            {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {isCopied ? "Copied" : "Copy response"}
          </button>
        )}
      </div>
    );
  };

  if (isPending) return <DocumentChatSkeleton />;

  if (isError || !data) {
    return (
      <div className="skim-chat-error">
        <div className="max-w-sm text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"><LockKeyhole className="size-5" /></span>
          <h2 className="mt-4 text-base font-semibold">This conversation is unavailable</h2>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">{error instanceof Error ? error.message : "Something went wrong while loading this conversation."}</p>
          <Button type="button" className="mt-4 rounded-xl" onClick={() => navigate("/dashboard")}>Back to library</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="skim-chat-page">
      <div className="skim-chat-scroll">
        <div className="skim-chat-feed">
          <div className="skim-chat-context">
            <span className="skim-chat-context-badge"><FileText className="size-3.5 text-primary" /> GROUNDED IN YOUR DOCUMENTS</span>
            <span>{selectedDocuments.length} source{selectedDocuments.length === 1 ? "" : "s"} selected</span>
          </div>

          {messageList.length === 0 ? (
            <ConversationEmpty />
          ) : (
            <>
              {data.messages.map((message) => renderMessage(message, message.messageId))}
              {optimisticMessages.map((message, index) => renderMessage(message, "optimistic-" + message.role + "-" + index, true))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="skim-composer-area">
        <div className="skim-composer-card">
          <div className="skim-composer-heading">
            <span className="skim-composer-title"><MessageSquareText className="size-3.5" /> Ask your documents</span>
            <span className="skim-composer-shortcut">ENTER TO SEND · SHIFT + ENTER FOR A NEW LINE</span>
          </div>

          <div className="skim-selected-documents">
            {selectedDocuments.length > 0 ? selectedDocuments.map((document) => (
              <span className="skim-selected-document" key={document.documentId}>
                <FileText className="size-3 shrink-0" />
                <span>{document.fileName}</span>
                <button type="button" aria-label={"Remove " + document.fileName} onClick={() => deselectDocument(document.documentId)}>
                  <CircleX className="size-3.5" />
                </button>
              </span>
            )) : (
              <span className="skim-no-documents">Select up to 3 PDFs from your library to give Skim context.</span>
            )}
          </div>

          <div className="skim-composer-input-row">
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={selectedDocuments.length ? "Ask anything about your selected PDFs…" : "Select a PDF from the sidebar to get started…"}
              className="skim-composer-textarea scrollbar-none"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (selectedDocumentIds.length === 0) toast.warning("Select a document to chat.");
                  else handleSend();
                }
              }}
              disabled={isStreaming}
            />
            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              disabled={!question.trim() || selectedDocumentIds.length === 0 || isStreaming}
              className="skim-send-button"
              aria-label="Send message"
              title="Send message"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>

          <div className="skim-composer-footer">
            <span>{selectedDocuments.length ? "Answers are grounded in your selected PDFs." : "Choose documents in the sidebar or library."}</span>
            <span>{selectedDocuments.length} / 3 sources selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentChat;