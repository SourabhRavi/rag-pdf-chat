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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
