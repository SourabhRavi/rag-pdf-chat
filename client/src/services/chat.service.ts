import type { ChatStreamEvent, SendMessageRequest } from "@/types/chat.types";

const CHAT_URL = "/chat";

export const streamChat = async (
  request: SendMessageRequest,
  signal?: AbortSignal,
  onEvent?: (event: ChatStreamEvent) => void,
): Promise<void> => {
  const response = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to start chat.");
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, {
      stream: true,
    });

    const events = buffer.split("\n\n");

    buffer = events.pop() ?? "";

    for (const rawEvent of events) {
      const event = parseSSEEvent(rawEvent);

      if (event) {
        onEvent?.(event);
      }
    }
  }

  buffer += decoder.decode();

  if (buffer.trim()) {
    const event = parseSSEEvent(buffer);

    if (event) {
      onEvent?.(event);
    }
  }
};

const parseSSEEvent = (rawEvent: string): ChatStreamEvent | null => {
  // split the lines for event and data
  const lines = rawEvent.split("\n");

  // get the event: "your-event"
  const eventLine = lines[0];

  // get the data: "{...}"
  const dataLine = lines[1];

  let eventType = "";
  let data = "";

  if (eventLine?.startsWith("event:")) {
    eventType = eventLine.slice(6).trim();
  }

  if (dataLine?.startsWith("data:")) {
    data = dataLine.slice(5).trim();
  }

  if (!eventType || !data) {
    return null;
  }

  return {
    type: eventType,
    ...JSON.parse(data),
  } as ChatStreamEvent;
};
