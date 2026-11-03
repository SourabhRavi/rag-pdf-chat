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
    return <div className="space-y-2 px-2"><Skeleton className="h-10 w-full rounded-lg" /><Skeleton className="h-10 w-full rounded-lg" /><Skeleton className="h-10 w-full rounded-lg" /></div>;
  }
  if (isError) return <p className="px-2 py-2 text-[10px] text-destructive">Documents couldn’t be loaded.</p>;
  if (documents.length === 0) {
    return <div className="px-2 py-4 text-center"><FileText className="mx-auto size-4 text-muted-foreground/55" /><p className="mt-2 text-[10px] text-muted-foreground">Upload a PDF to build your library.</p></div>;
  }

  return (
    <SidebarMenu className="flex flex-col gap-1">
      {documents.map((document) => {
        const selected = isDocumentSelected(document.documentId);
        return (
          <SidebarMenuItem key={document.documentId}>
            <div
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              data-selected={selected}
              className={cn("skim-sidebar-document")}
              onClick={() => toggleDocumentSelection(document.documentId)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleDocumentSelection(document.documentId);
                }
              }}
            >
              <Checkbox
                checked={selected}
                onCheckedChange={() => toggleDocumentSelection(document.documentId)}
                onClick={(event) => event.stopPropagation()}
                aria-label={(selected ? "Deselect " : "Select ") + document.fileName}
              />
              <FileText className={cn("size-3.5 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
              <div className="min-w-0 flex-1">
                <p className="skim-sidebar-document-name">{document.fileName}</p>
                <p className="skim-sidebar-document-date">
                  {new Date(document.uploadedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default DocumentList;