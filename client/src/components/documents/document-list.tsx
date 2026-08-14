import { FileText, MoreHorizontal } from "lucide-react";
import type { Document } from "@/types/document.types";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";

type DocumentListProps = {
  documents: Document[];
  isPending: boolean;
  isError: boolean;
};

const DocumentList = ({ documents, isPending, isError }: DocumentListProps) => {
  const { isDocumentSelected, toggleDocumentSelection } = useDashboardWorkspace();

  if (isPending) {
    return (
      <div className="space-y-2 px-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="px-2 text-xs text-destructive">Failed to load documents.</p>;
  }

  if (documents.length === 0) {
    return <p className="px-2 text-xs text-muted-foreground">No documents yet.</p>;
  }

  return (
    <SidebarMenu>
      {documents.map((document) => {
        const selected = isDocumentSelected(document.documentId);

        return (
          <SidebarMenuItem key={document.documentId}>
            <SidebarMenuButton
              className="h-auto min-h-12 px-2 py-2"
              isActive={selected}
              onClick={() => toggleDocumentSelection(document.documentId)}
            >
              <Checkbox
                checked={selected}
                onCheckedChange={() => toggleDocumentSelection(document.documentId)}
                onClick={(event) => event.stopPropagation()}
                aria-label={`Select ${document.fileName}`}
              />

              <FileText className="size-4 shrink-0 text-muted-foreground" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{document.fileName}</p>

                <p className="text-[11px] text-muted-foreground">
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <MoreHorizontal
                className="size-4 shrink-0 text-muted-foreground"
                onClick={(event) => event.stopPropagation()}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default DocumentList;
