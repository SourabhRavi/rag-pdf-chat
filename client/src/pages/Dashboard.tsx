import { Sparkles, Upload } from "lucide-react";

import DocumentUpload from "@/components/documents/document-upload";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { useNavigate } from "react-router-dom";
import { useCreateConversation } from "@/hooks/use-create-conversation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectDocument } = useDashboardWorkspace();

  const { mutate: createConversation } = useCreateConversation();

  const handleUploadSuccess = (documentId: string) => {
    selectDocument(documentId);

    createConversation(undefined, {
      onSuccess: ({ conversationId }) => {
        navigate(`/conversation/${conversationId}`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create a conversation. Please try again.",
        );
      },
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Empty chat area */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-2xl flex-col items-center px-6 text-center">
          <Skeleton className="h-12 w-12 rounded-full bg-transparent">
            <Sparkles size={30} className="fill-primary stroke-primary" />
          </Skeleton>

          <h2 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
            Skip the scrolling. Just ask!
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            Upload a PDF or select one from your documents and get straight to the answers you need.
          </p>

          <p className="mt-1 text-xs text-muted-foreground/70">PDF only · 10 MB maximum</p>

          <DocumentUpload
            className={
              "mt-7 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:text-primary-foreground transition-colors hover:bg-primary/90 dark:hover:bg-primary/90"
            }
            onUploadSuccess={handleUploadSuccess}
          >
            <Upload className="size-4" />
            Upload your PDF
          </DocumentUpload>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
