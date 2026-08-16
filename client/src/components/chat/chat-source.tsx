import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ChatSource } from "@/types/chat.types";
import { FileText } from "lucide-react";

export const Sources = ({ sources }: { sources: ChatSource[] }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <Collapsible className="mt-3 w-full">
      <Card className="overflow-hidden border-border/60 bg-background/60 shadow-none">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-muted">
              <FileText className="size-3.5 text-muted-foreground" />
            </div>

            <span className="text-xs font-medium">Sources</span>

            <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px]">
              {sources.length}
            </Badge>
          </div>

          <span className="text-xs text-muted-foreground">View sources</span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Separator />

          <div className="divide-y">
            {sources.map((source) => (
              <div
                key={source.documentId}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/30"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <FileText className="size-4 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{source.fileName}</p>

                  {source.uploadedAt && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Uploaded {new Date(source.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
