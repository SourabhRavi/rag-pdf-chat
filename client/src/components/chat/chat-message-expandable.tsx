import { useRef, useState } from "react";
import { useIsOverflowing } from "@/hooks/use-is-overflowing";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronUp } from "lucide-react";

const COLLAPSED_HEIGHT = 160;

export const ExpandableMessage = ({ content }: { content: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const isOverflowing = useIsOverflowing(ref, COLLAPSED_HEIGHT, content);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "whitespace-pre-wrap px-2 pb-2",
          !expanded && `max-h-40 overflow-hidden scroll-fade scroll-fade-18`,
        )}
      >
        <div className="typeset typeset-chat px-2 text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>

      {isOverflowing && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex w-full cursor-pointer items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? "Show less" : "Show more"}

          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-5" />}
        </button>
      )}
    </>
  );
};
