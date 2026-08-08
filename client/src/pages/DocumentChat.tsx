import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import { getDocument } from "@/services/document.service";
import type { UploadResponse } from "@/types/api.types";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const DocumentChat = () => {
  const location = useLocation();
  const { documentId } = useParams();

  const [document, setDocument] = useState<UploadResponse | null>(location.state ?? null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (document || !documentId) return;

    const fetchDocument = async () => {
      try {
        const { data } = await getDocument(documentId);
        setDocument(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocument();
  }, [document, documentId]);

  const handleAsk = async () => {
    if (!question.trim() || !documentId) return;

    try {
      setIsLoading(true);

      // const response = await api.post("/chat", {
      //   documentId,
      //   question,
      // });

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: question,
        },
      ]);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          question,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to stream response");
      }

      const reader = response.body.getReader();

      let assistantMessage = "";

      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        assistantMessage += chunk;

        setMessages((prev) => {
          const lastIndex = prev.length - 1;

          if (prev[lastIndex]?.role !== "assistant") {
            return [
              ...prev,
              {
                role: "assistant",
                content: assistantMessage,
              },
            ];
          }

          const updatedMessages = [...prev];

          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            content: assistantMessage,
          };

          return updatedMessages;
        });
      }

      setQuestion("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Filename: {document?.fileName}</h1>

      <div className="mt-5">
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <strong>{message.role}:</strong> {message.content}
            </div>
          ))}
        </div>

        <div>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something about this PDF..."
          />
          <Button onClick={handleAsk} disabled={!question.trim() || isLoading}>
            {isLoading ? "Thinking..." : "Ask"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentChat;
