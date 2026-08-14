import { AppSidebar } from "@/components/common/dashboard/app-sidebar";
import ThemeToggle from "@/components/common/theme-toggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: AuthLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex h-svh flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 sm:px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />

            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold">New Chat</h1>

              <span className="rounded-md bg-primary/20 dark:bg-primary/40 dark:text-muted-foreground px-2 py-0.5 text-xs text-primary">
                0 documents
              </span>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
