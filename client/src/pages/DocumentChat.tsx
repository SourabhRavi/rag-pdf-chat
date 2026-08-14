import { ArrowUp, CircleX, FileText } from "lucide-react";
import { useParams } from "react-router-dom";

import { Textarea } from "@/components/ui/textarea";
import { useDocuments } from "@/hooks/use-documents";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";

const DocumentChat = () => {
  const { conversationId } = useParams();

  const { data: documents = [] } = useDocuments();
  const { selectedDocumentIds, toggleDocumentSelection } = useDashboardWorkspace();

  const selectedDocuments = documents.filter((document) =>
    selectedDocumentIds.includes(document.documentId),
  );

  return (
    <>
      {/* Composer */}
      <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-6 sm:pb-6 self-end">
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
              placeholder="Ask a question about your documents..."
              className="min-h-10 max-h-32 w-full resize-none overflow-y-auto border-0 p-2 text-sm shadow-none focus-visible:ring-0 sm:text-base"
            />

            <button
              type="button"
              disabled
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              aria-label="Send message"
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
    </>
  );
};

export default DocumentChat;
