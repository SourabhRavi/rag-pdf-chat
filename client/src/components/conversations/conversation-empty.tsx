import DocumentUpload from "@/components/documents/document-upload";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "@/assets/logo/skim-logo-svg.svg?react";

const ConversationEmpty = () => {
  const { selectDocument, selectedDocumentIds } = useDashboardWorkspace();

  const handleUploadSuccess = (documentId: string) => {
    selectDocument(documentId);
  };
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-2xl flex-col items-center px-6 text-center">
          {/* Keep this completely outside the animation */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="rounded-full overflow-hidden">
              <Logo className="size-15 text-primary" />
            </div>
          </motion.div>

          {/* Stable slot for changing content */}
          <div className="relative w-full min-h-44">
            <AnimatePresence mode="wait">
              {selectedDocumentIds.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 top-0 flex flex-col items-center"
                >
                  <h2 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
                    Start a new conversation
                  </h2>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                    Select a PDF or upload one to get started.
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground/70">PDF only · 10 MB maximum</p>

                  <DocumentUpload
                    onUploadSuccess={handleUploadSuccess}
                    className="mt-7 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Upload className="size-4" />
                    Upload your PDF
                  </DocumentUpload>
                </motion.div>
              ) : (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 top-0 flex flex-col items-center"
                >
                  <h2 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
                    Got questions? Ask away
                  </h2>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                    Ask questions, get explanations, or find something specific in your PDFs.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationEmpty;
