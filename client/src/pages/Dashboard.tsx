import { ArrowRight, ArrowUpRight, BookOpen, Check, Clock3, FileText, MessageSquareText, Activity, Upload, Plus, MessagesSquare } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DocumentUpload from "@/components/documents/document-upload";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { useDocuments } from "@/hooks/use-documents";
import { useConversations } from "@/hooks/use-conversations";
import { useUsage } from "@/hooks/use-usage";
import { useCreateConversation } from "@/hooks/use-create-conversation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedDocumentIds, selectDocument, toggleDocumentSelection, isDocumentSelected } = useDashboardWorkspace();
  const { data: documents = [], isPending: documentsPending, isError: documentsError } = useDocuments();
  const { data: conversations = [], isPending: conversationsPending } = useConversations();
  const { data: usage } = useUsage();
  const { mutate: createConversation, isPending: isCreatingConversation } = useCreateConversation();

  const recentDocuments = useMemo(
    () => [...documents].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).slice(0, 5),
    [documents],
  );
  const recentConversations = useMemo(
    () => [...conversations].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5),
    [conversations],
  );

  const startConversation = () => {
    createConversation(undefined, {
      onSuccess: ({ conversationId }) => navigate("/conversation/" + conversationId),
      onError: (error) => toast.error(error instanceof Error ? error.message : "Couldn't start a conversation. Please try again."),
    });
  };

  const handleUploadSuccess = (documentId: string) => {
    selectDocument(documentId);
    createConversation(undefined, {
      onSuccess: ({ conversationId }) => navigate("/conversation/" + conversationId),
      onError: (error) => toast.error(error instanceof Error ? error.message : "PDF uploaded, but a conversation couldn't be started."),
    });
  };

  const questionsUsed = usage?.used ?? 0;
  const questionLimit = usage?.max_limit ?? 10;

  return (
    <div className="skim-dashboard-page">
      <div className="skim-dashboard-inner">
        <div className="skim-dashboard-heading">
          <div>
            <span className="skim-eyebrow"><BookOpen className="size-3.5" /> YOUR KNOWLEDGE WORKSPACE</span>
            <h1 className="skim-dashboard-title">Everything you need to know.</h1>
            <p className="skim-dashboard-subtitle">
              Bring your PDFs together, ask better questions, and get answers grounded in the documents that matter.
            </p>
          </div>
          <div className="skim-dashboard-actions">
            <button type="button" className="skim-button-secondary inline-flex items-center justify-center" onClick={startConversation} disabled={isCreatingConversation}>
              <Plus className="size-3.5" />
              {isCreatingConversation ? "Creating…" : "New chat"}
            </button>
            <DocumentUpload className="skim-button-primary" onUploadSuccess={handleUploadSuccess}>
              <Upload className="size-3.5" />
              Upload PDF
            </DocumentUpload>
          </div>
        </div>

        <section className="skim-hero">
          <div className="skim-hero-copy">
            <span className="skim-hero-kicker"><FileText className="size-3.5" /> LESS SEARCHING. MORE UNDERSTANDING.</span>
            <h2 className="skim-hero-title">Turn your documents into <span>clear answers.</span></h2>
            <p className="skim-hero-description">
              Upload a PDF and have a focused conversation with your own knowledge. Skim finds the relevant context before it answers.
            </p>
            <div className="skim-hero-actions">
              <DocumentUpload className="h-10 gap-2 rounded-xl bg-white px-4 text-[11px] font-semibold text-[#37366d] shadow-lg hover:bg-[#f1f0ff]" onUploadSuccess={handleUploadSuccess}>
                <Upload className="size-3.5" />
                Add a document
              </DocumentUpload>
              <span className="flex items-center gap-1.5 text-[9px] font-medium text-white/60">
                <FileText className="size-3" /> PDF · Up to 5 MB
              </span>
            </div>
          </div>
          <div className="skim-hero-visual" aria-hidden="true">
            <div className="skim-hero-orbit" />
            <div className="skim-preview-document">
              <span className="skim-preview-document-icon"><FileText className="size-5" /></span>
              <span className="mt-3 text-[9px] font-bold tracking-[0.12em] text-[#6b68a5]">YOUR KNOWLEDGE</span>
              <div className="skim-preview-document-lines">
                <span /><span /><span /><span />
              </div>
              <span className="mt-auto text-[8px] font-medium text-[#9999b3]">PDF · READY TO EXPLORE</span>
            </div>
            <div className="skim-preview-ai"><MessageSquareText className="size-3.5" /> Context-aware answers</div>
          </div>
        </section>

        <section className="skim-stats-grid" aria-label="Workspace overview">
          <div className="skim-stat-card">
            <span className="skim-stat-icon"><FilesIcon /></span>
            <div>
              <p className="skim-stat-label">Documents in your library</p>
              <p className="skim-stat-value">{documentsPending ? "—" : documents.length}</p>
            </div>
          </div>
          <div className="skim-stat-card">
            <span className="skim-stat-icon"><MessagesSquare className="size-[18px]" /></span>
            <div>
              <p className="skim-stat-label">Conversations</p>
              <p className="skim-stat-value">{conversationsPending ? "—" : conversations.length}</p>
            </div>
          </div>
          <div className="skim-stat-card">
            <span className="skim-stat-icon"><Activity className="size-[18px]" /></span>
            <div>
              <p className="skim-stat-label">Questions used today</p>
              <p className="skim-stat-value">{usage ? questionsUsed + " / " + questionLimit : "—"}</p>
            </div>
          </div>
        </section>

        {selectedDocumentIds.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/15 bg-primary/[0.045] px-4 py-3">
            <div className="flex items-center gap-2 text-[10px] text-foreground">
              <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary"><Check className="size-3.5" /></span>
              <span><strong>{selectedDocumentIds.length} document{selectedDocumentIds.length === 1 ? "" : "s"}</strong> ready to use as context.</span>
            </div>
            <button type="button" className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary hover:underline" onClick={startConversation} disabled={isCreatingConversation}>
              Start a conversation <ArrowRight className="size-3.5" />
            </button>
          </div>
        )}

        <div className="skim-dashboard-columns">
          <section className="skim-panel">
            <header className="skim-panel-header">
              <div>
                <h2 className="skim-panel-title">Your document library</h2>
                <p className="skim-panel-description">Choose the PDFs you want Skim to use as context.</p>
              </div>
              <span className="skim-sidebar-count">{documentsPending ? "…" : documents.length}</span>
            </header>
            <div className="skim-panel-body">
              {documentsPending ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map((item) => <Skeleton key={item} className="h-[58px] w-full rounded-xl" />)}
                </div>
              ) : documentsError ? (
                <div className="skim-empty-state">
                  <div className="skim-empty-icon"><FileText className="size-5" /></div>
                  <p className="skim-empty-title">Library unavailable</p>
                  <p className="skim-empty-copy">We couldn't load your documents. Refresh the page and try again.</p>
                </div>
              ) : recentDocuments.length === 0 ? (
                <div className="skim-empty-state">
                  <div className="skim-empty-icon"><BookOpen className="size-5" /></div>
                  <p className="skim-empty-title">Your library starts here</p>
                  <p className="skim-empty-copy">Upload a PDF to make its contents searchable and ready for a conversation.</p>
                  <DocumentUpload className="skim-button-primary mt-4" onUploadSuccess={handleUploadSuccess}>
                    <Upload className="size-3.5" /> Upload your first PDF
                  </DocumentUpload>
                </div>
              ) : (
                recentDocuments.map((document) => {
                  const selected = isDocumentSelected(document.documentId);
                  return (
                    <button
                      type="button"
                      key={document.documentId}
                      data-selected={selected}
                      className="skim-library-row"
                      aria-pressed={selected}
                      onClick={() => toggleDocumentSelection(document.documentId)}
                    >
                      <span className="skim-file-icon"><FileText className="size-[17px]" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="skim-library-name block">{document.fileName}</span>
                        <span className="skim-library-meta block">Added {formatDate(document.uploadedAt)}</span>
                      </span>
                      <span className="skim-row-trailing">
                        {selected ? <Check className="size-4 text-primary" /> : <ArrowUpRight className="size-4" />}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="skim-panel">
            <header className="skim-panel-header">
              <div>
                <h2 className="skim-panel-title">Recent conversations</h2>
                <p className="skim-panel-description">Pick up where you left off.</p>
              </div>
              <span className="skim-sidebar-count">{conversationsPending ? "…" : conversations.length}</span>
            </header>
            <div className="skim-panel-body">
              {conversationsPending ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map((item) => <Skeleton key={item} className="h-[54px] w-full rounded-xl" />)}
                </div>
              ) : recentConversations.length === 0 ? (
                <div className="skim-empty-state">
                  <div className="skim-empty-icon"><MessageSquareText className="size-5" /></div>
                  <p className="skim-empty-title">No conversations yet</p>
                  <p className="skim-empty-copy">Select one or more PDFs, then start a chat to explore their contents.</p>
                </div>
              ) : (
                recentConversations.map((conversation) => (
                  <button
                    type="button"
                    key={conversation.conversationId}
                    className="skim-conversation-row"
                    onClick={() => navigate("/conversation/" + conversation.conversationId)}
                  >
                    <span className="skim-conversation-icon"><MessageSquareText className="size-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="skim-conversation-title block">{conversation.title}</span>
                      <span className="skim-conversation-date block"><Clock3 className="mr-1 inline size-3" />Updated {formatDate(conversation.updatedAt)}</span>
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 px-1 text-[9px] text-muted-foreground/75">
          <span>Skim · Your documents, in context.</span>
          <span>Answers grounded in your uploaded PDFs</span>
        </footer>
      </div>
    </div>
  );
};

const FilesIcon = () => <FileText className="size-[18px]" />;

export default Dashboard;