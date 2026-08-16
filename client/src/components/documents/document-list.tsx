import { FileText } from "lucide-react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useDocuments } from "@/hooks/use-documents";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { cn } from "@/lib/utils";

const DocumentList = () => {
  const { data: documents = [], isPending, isError } = useDocuments();
  const { isDocumentSelected, toggleDocumentSelection } = useDashboardWorkspace();

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
    <SidebarMenu className="flex-col gap-1 max-h-60 overflow-auto">
      {documents.map((document) => {
        const selected = isDocumentSelected(document.documentId);

        return (
          <SidebarMenuItem key={document.documentId} className="min-h-10">
            <div
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                selected &&
                  "bg-primary/15 text-primary dark:bg-primary/40 hover:bg-primary/25 dark:hover:bg-primary/60",
              )}
              onClick={() => toggleDocumentSelection(document.documentId)}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => toggleDocumentSelection(document.documentId)}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Select ${document.fileName}`}
                />

                <FileText
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    selected ? "text-primary dark:text-foreground" : "text-muted-foreground",
                  )}
                  strokeWidth={selected ? 2.5 : 2}
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm transition-colors",
                      selected && "font-medium text-primary dark:text-foreground",
                    )}
                  >
                    {document.fileName}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* later add delete in popover */}
              {/* <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                aria-label={`More options for ${document.fileName}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <MoreHorizontal className="size-4" />
              </button> */}
            </div>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default DocumentList;
