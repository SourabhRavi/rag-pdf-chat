import { AlertCircle, Check, FileText } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/hooks/use-documents";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });

const DocumentList = () => {
  const { data: documents = [], isPending, isError } = useDocuments();
  const { isDocumentSelected, toggleDocumentSelection } = useDashboardWorkspace();

  if (isPending) {
    return (
      <SidebarMenu className="skim-document-list">
        {[0, 1, 2].map((item) => (
          <SidebarMenuItem key={item}>
            <SidebarMenuButton disabled className="skim-document-button">
              <Skeleton className="size-4 shrink-0 rounded" />
              <span className="skim-document-details min-w-0 flex-1">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="mt-1 h-2 w-16 rounded" />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (isError) {
    return (
      <SidebarMenu className="skim-document-list">
        <SidebarMenuItem>
          <SidebarMenuButton disabled tooltip="Documents couldn't be loaded">
            <AlertCircle className="size-4 shrink-0" />
            <span className="skim-document-details">Unavailable</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (documents.length === 0) {
    return (
      <SidebarMenu className="skim-document-list">
        <SidebarMenuItem>
          <SidebarMenuButton disabled tooltip="Upload a PDF to build your library">
            <FileText className="size-4 shrink-0" />
            <span className="skim-document-details">No documents yet</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu className="skim-document-list">
      {documents.map((document) => {
        const selected = isDocumentSelected(document.documentId);

        return (
          <SidebarMenuItem key={document.documentId}>
            <SidebarMenuButton
              tooltip={document.fileName}
              isActive={selected}
              aria-pressed={selected}
              data-selected={selected}
              className="skim-document-button"
              onClick={() => toggleDocumentSelection(document.documentId)}
            >
              <FileText className="skim-document-icon size-4 shrink-0" />
              <span className="skim-document-details min-w-0 flex-1">
                <span className="skim-sidebar-document-name block">{document.fileName}</span>
                <span className="skim-sidebar-document-date mt-0.5 block">
                  Added {formatDate(document.uploadedAt)}
                </span>
              </span>
              {selected && (
                <Check className="skim-document-selected-mark size-3.5 shrink-0 text-primary" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default DocumentList;