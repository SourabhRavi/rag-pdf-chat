import { AppSidebar } from "@/components/common/dashboard/app-sidebar";
import ThemeToggle from "@/components/common/theme-toggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardWorkspaceProvider } from "@/context/dashboard-workspace/dashboard-workspace-provider";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { Outlet } from "react-router-dom";

const DashboardLayoutContent = () => {
  const { selectedDocumentIds } = useDashboardWorkspace();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex h-svh flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 sm:px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />

            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold">New Chat</h1>

              <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs text-primary dark:bg-primary/40 dark:text-muted-foreground">
                {selectedDocumentIds.length}{" "}
                {selectedDocumentIds.length === 1 ? "document" : "documents"} selected
              </span>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <main className="min-h-0 flex flex-1 justify-center overflow-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const DashboardLayout = () => {
  return (
    <DashboardWorkspaceProvider>
      <DashboardLayoutContent />
    </DashboardWorkspaceProvider>
  );
};

export default DashboardLayout;
