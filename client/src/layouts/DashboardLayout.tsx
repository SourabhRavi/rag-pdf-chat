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
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useSidebar } from "@/components/ui/sidebar";

const DashboardLayoutContent = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { data, isPending } = useConversation(conversationId);
  const { selectedDocumentIds } = useDashboardWorkspace();
  const { state, isMobile } = useSidebar();
  const [showMobileSidebarHint, setShowMobileSidebarHint] = useState(false);
  const title = data?.conversation.title ?? (conversationId ? "New conversation" : "Your library");

  useEffect(() => {
    if (!isMobile) {
      setShowMobileSidebarHint(false);
      return;
    }

    try {
      const hintWasShown = window.localStorage.getItem("skim-mobile-sidebar-hint-seen") === "true";
      if (!hintWasShown) {
        setShowMobileSidebarHint(true);
        window.localStorage.setItem("skim-mobile-sidebar-hint-seen", "true");
      }
    } catch {
      setShowMobileSidebarHint(true);
    }
  }, [isMobile]);

  const dismissMobileSidebarHint = () => {
    setShowMobileSidebarHint(false);
    try {
      window.localStorage.setItem("skim-mobile-sidebar-hint-seen", "true");
    } catch {
      // The hint remains dismissible for this session when storage is unavailable.
    }
  };
  const sidebarStyle = {
    "--sidebar-width": "17.5rem",
    "--sidebar-width-icon": "4.35rem",
  } as CSSProperties;

  return (
    <SidebarProvider className="skim-app-shell" style={sidebarStyle}>
      <AppSidebar />
      <SidebarInset className="skim-main-panel flex min-h-0 flex-col overflow-hidden">
        <header className="skim-topbar">
          <div className="skim-topbar-left">
            <div className="skim-sidebar-trigger-wrap">
              <SidebarTrigger
                className="size-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={isMobile ? "Open sidebar" : state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
                title={isMobile ? "Open sidebar" : state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
                onClick={dismissMobileSidebarHint}
              />
              {showMobileSidebarHint && isMobile && (
                <div className="skim-mobile-sidebar-hint" role="status">
                  <span className="skim-mobile-sidebar-hint-arrow" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">Your sidebar is here</p>
                    <p className="mt-1 text-muted-foreground">Open it to find your conversations and documents.</p>
                  </div>
                  <button type="button" className="skim-mobile-sidebar-hint-dismiss" onClick={dismissMobileSidebarHint}>
                    Got it
                  </button>
                </div>
              )}
            </div>
            <button type="button" onClick={() => navigate("/dashboard")} className="skim-mobile-brand" aria-label="Go to Skim dashboard">
              <Logo />
              <WordMark className="h-[17px] w-auto text-foreground" />
            </button>
            <div className="hidden min-w-0 flex-col md:flex">
              <span className="skim-topbar-kicker">{conversationId ? "Document conversation" : "Knowledge workspace"}</span>
              {isPending && conversationId ? <Skeleton className="h-4 w-36 rounded-md" /> : <h1 className="skim-topbar-title">{title}</h1>}
            </div>
          </div>
          <div className="skim-topbar-right">
            <div className="skim-topbar-status">
              <span className="skim-topbar-status-dot" />
              <span>{selectedDocumentIds.length ? selectedDocumentIds.length + " source" + (selectedDocumentIds.length === 1 ? "" : "s") + " selected" : "Ready for your documents"}</span>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="skim-route-content">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const DashboardLayout = () => (
  <DashboardWorkspaceProvider>
    <DashboardLayoutContent />
  </DashboardWorkspaceProvider>
);

export default DashboardLayout;