import * as React from "react";
import { Plus, Upload, Activity, Files, MessageSquareText } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import DocumentList from "@/components/documents/document-list";
import ConversationList from "@/components/conversations/conversation-list";
import UsageIndicator from "@/components/usage/usage-indicator";
import DocumentUpload from "@/components/documents/document-upload";
import { useNavigate } from "react-router-dom";
import { useCreateConversation } from "@/hooks/use-create-conversation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/assets/logo/skim-logo-svg.svg?react";
import WordMark from "@/assets/logo/skim-wordmark-svg.svg?react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { mutate: createConversation, isPending } = useCreateConversation();

  const handleNewChatClick = () => {
    createConversation(undefined, {
      onSuccess: ({ conversationId }) => navigate("/conversation/" + conversationId),
      onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to create a new conversation."),
    });
  };

  return (
    <Sidebar {...props} collapsible="icon" variant="inset" className="skim-sidebar">
      <SidebarHeader className="skim-sidebar-header">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <button type="button" onClick={() => navigate("/dashboard")} className="skim-brand" aria-label="Skim dashboard">
            <span className="skim-brand-mark"><Logo /></span>
            <WordMark className="skim-brand-wordmark group-data-[collapsible=icon]:hidden" />
          </button>
          <span className="skim-demo-badge group-data-[collapsible=icon]:hidden">GUEST DEMO</span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="New chat" className="skim-new-chat-button" onClick={handleNewChatClick} disabled={isPending}>
              {isPending ? <Spinner className="size-4" /> : <Plus className="size-4" />}
              <span>{isPending ? "Creating…" : "New chat"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="skim-sidebar-content">
        <SidebarGroup className="skim-sidebar-group skim-sidebar-group-conversations">
          {isCollapsed ? (
            <SidebarMenu className="skim-collapsed-section-action">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Conversations"
                  aria-label="Open conversations"
                  className="skim-rail-section-button"
                  onClick={() => setOpen(true)}
                >
                  <MessageSquareText className="size-4" />
                  <span className="sr-only">Conversations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : (
            <>
              <div className="skim-sidebar-group-heading">
                <SidebarGroupLabel>
                  <MessageSquareText className="mr-1.5 size-3.5" />
                  Conversations
                </SidebarGroupLabel>
              </div>
              <div className="skim-sidebar-scroll">
                <ConversationList />
              </div>
            </>
          )}
        </SidebarGroup>

        <SidebarGroup className="skim-sidebar-group skim-sidebar-group-documents">
          {isCollapsed ? (
            <SidebarMenu className="skim-collapsed-section-action">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Documents"
                  aria-label="Open documents"
                  className="skim-rail-section-button"
                  onClick={() => setOpen(true)}
                >
                  <Files className="size-4" />
                  <span className="sr-only">Documents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : (
            <>
              <div className="skim-sidebar-expanded-content">
                <div className="skim-sidebar-group-heading">
                  <SidebarGroupLabel>
                    <Files className="mr-1.5 size-3.5" />
                    Documents
                  </SidebarGroupLabel>
                  <DocumentUpload
                    variant="outline"
                    size="xs"
                    className="skim-upload-inline"
                    title="Upload a PDF"
                    aria-label="Upload a PDF"
                  >
                    <Upload className="size-3.5" />
                    <span>Upload</span>
                  </DocumentUpload>
                </div>
                <div className="skim-sidebar-scroll">
                  <DocumentList />
                </div>
              </div>
            </>
          )}
        </SidebarGroup>
      <SidebarFooter className="skim-sidebar-footer">
        <div className="mb-1 flex items-center gap-2 px-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground group-data-[collapsible=icon]:hidden">
          <Activity className="size-3.5 text-primary" />Your daily workspace
        </div>
        <UsageIndicator />
      </SidebarFooter>
    </Sidebar>
  );
}