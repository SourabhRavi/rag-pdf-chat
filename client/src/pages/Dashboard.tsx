import { Sparkles, Upload } from "lucide-react";

import DocumentUpload from "@/components/documents/document-upload";

const Dashboard = () => {
  return (
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

          <DocumentUpload
            className={
              "mt-7 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:text-primary-foreground transition-colors hover:bg-primary/90"
            }
          >
            <Upload className="size-4" />
            Upload your first PDF
          </DocumentUpload>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
