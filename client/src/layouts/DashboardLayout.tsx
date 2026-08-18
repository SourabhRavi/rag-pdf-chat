import { AppSidebar } from "@/components/common/dashboard/app-sidebar";
import ThemeToggle from "@/components/common/theme-toggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardWorkspaceProvider } from "@/context/dashboard-workspace/dashboard-workspace-provider";
import { useDashboardWorkspace } from "@/context/dashboard-workspace/use-dashboard-workspace";
import { useConversation } from "@/hooks/use-conversation";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Logo from "@/assets/logo/skim-logo-svg.svg?react";
import WordMark from "@/assets/logo/skim-wordmark-svg.svg?react";

const DashboardLayoutContent = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useConversation(conversationId);

  const { selectedDocumentIds } = useDashboardWorkspace();

  const title = data?.conversation.title ?? "New Chat";

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex h-svh flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <SidebarTrigger className="-ml-1" />

            <div className="flex min-w-0 items-center justify-start">
              <div className="flex items-center justify-between pr-2">
                <div
                  onClick={() => navigate("dashboard")}
                  className="flex min-w-0 items-center gap-1.5 cursor-pointer md:hidden"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center">
                    <Logo className="size-8 text-foreground" />
                  </div>

                  <WordMark className="h-5 w-auto object-contain text-foreground" />
                </div>
              </div>
              {isPending ? (
                <Skeleton className="capitalize min-w-0 max-w-40 sm:max-w-3 md:max-w-36 lg:max-w-60 xl:max-w-80" />
              ) : (
                title && (
                  <h1 className="capitalize min-w-0 max-w-40 sm:max-w-3 md:max-w-36 lg:max-w-60 xl:max-w-80 truncate text-sm font-semibold pr-2.5 hidden md:block">
                    {title}
                  </h1>
                )
              )}

              <span className="shrink-0 rounded-md bg-primary/20 dark:bg-primary/70 px-2 py-0.5 text-xs text-primary dark:text-foreground/70 hidden sm:block">
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
