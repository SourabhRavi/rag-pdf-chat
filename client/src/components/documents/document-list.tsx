import { FileText, MoreHorizontal } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/hooks/use-documents";

const DocumentList = () => {
  const { data: documents = [], isPending, isError } = useDocuments();

  if (isPending) {
    return (
      <div className="space-y-2 px-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="px-2 text-xs text-destructive">Failed to load documents.</p>;
  }

  if (documents.length === 0) {
    return <p className="pr-2 text-xs text-muted-foreground">No documents yet.</p>;
  }

  return (
    <SidebarMenu>
      {documents.map((document) => (
        <SidebarMenuItem key={document.documentId} className="min-h-10">
          <SidebarMenuButton className="h-auto min-h-12 px-2 py-2">
            <FileText className="size-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{document.fileName}</p>

              <p className="text-[11px] text-muted-foreground">
                {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            </div>

            <MoreHorizontal className="size-4 shrink-0 text-muted-foreground" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default DocumentList;
