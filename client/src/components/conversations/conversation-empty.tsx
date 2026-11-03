import DocumentUpload from "@/components/documents/document-upload";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { Upload, Sparkles, FileText } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "@/assets/logo/skim-logo-svg.svg?react";

const ConversationEmpty = () => {
  const { selectDocument, selectedDocumentIds } = useDashboardWorkspace();

  const handleUploadSuccess = (documentId: string) => selectDocument(documentId);

  return (
    <div className="skim-chat-empty">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: .96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .45, ease: [.2, .75, .25, 1] }}
        className="skim-chat-empty-mark"
      >
        <Logo className="size-9" />
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedDocumentIds.length === 0 ? (
          <motion.div
            key="no-documents"
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: .2 }}
            className="flex flex-col items-center"
          >
            <h2 className="skim-chat-empty-title">A good question starts with context.</h2>
            <p className="skim-chat-empty-description">
              Select a PDF from your library or upload one. Skim will find the relevant passages before it answers.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[9px] text-muted-foreground/80">
              <FileText className="size-3" /> PDF only · 5 MB maximum
            </span>
            <DocumentUpload onUploadSuccess={handleUploadSuccess} className="skim-button-primary mt-5">
              <Upload className="size-3.5" /> Upload a PDF
            </DocumentUpload>
          </motion.div>
        ) : (
          <motion.div
            key="documents-selected"
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: .2 }}
            className="flex flex-col items-center"
          >
            <h2 className="skim-chat-empty-title">Your documents are ready.</h2>
            <p className="skim-chat-empty-description">
              Ask a question about the {selectedDocumentIds.length} selected PDF{selectedDocumentIds.length === 1 ? "" : "s"}. Skim will keep its answers grounded in those files.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1.5 text-[9px] font-semibold text-primary">
              <Sparkles className="size-3" /> Ready for your first question
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversationEmpty;