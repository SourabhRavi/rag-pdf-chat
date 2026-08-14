import { ArrowUp, CircleX, FileText, Sparkles, Upload } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Textarea } from "@/components/ui/textarea";

const Dashboard = () => {
  const selectedDocuments = ["AI Basics.pdf", "RAG Guide.pdf"];

  return (
    <DashboardLayout>
      <div className="flex h-full min-h-0 flex-col">
        {/* Empty chat area */}
        <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
          <div className="flex w-full max-w-2xl flex-col items-center px-6 text-center">
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl border bg-muted/50">
              <Sparkles className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
              Ask anything about your documents
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Upload a PDF, select up to 3 documents, and start asking questions. RAG Chat will find
              the relevant information for you.
            </p>

            <p className="mt-1 text-xs text-muted-foreground/70">PDF only · 10 MB maximum</p>

            <button className="mt-7 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              <Upload className="size-4" />
              Upload your first PDF
            </button>
          </div>
        </div>

        {/* Composer */}
        <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="rounded-xl border bg-background shadow-sm">
            {/* selected documents */}
            {selectedDocuments.length > 0 && (
              <div className="flex flex-wrap gap-2 px-3 pt-3">
                {selectedDocuments.map((document) => (
                  <div
                    key={document}
                    className="flex max-w-full items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1 text-xs"
                  >
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />

                    <span className="max-w-40 truncate">{document}</span>

                    <button
                      type="button"
                      className="ml-0.5 rounded-sm text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${document}`}
                    >
                      <CircleX className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 p-3">
              <Textarea
                placeholder="Ask a question about your documents..."
                className="min-h-10 max-h-32 resize-none overflow-y-auto border-0 p-2 shadow-none focus-visible:ring-0"
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
            <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
              <span className="text-xs text-muted-foreground">
                {selectedDocuments.length} of 3 documents selected
              </span>

              <span className="text-xs text-muted-foreground">Select documents to get started</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
