import * as React from "react";
import { Plus, Upload } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import DocumentList from "@/components/documents/document-list";
import ConversationList from "@/components/conversations/conversation-list";
import UsageIndicator from "@/components/usage/usage-indicator";
import DocumentUpload from "@/components/documents/document-upload";
import { useNavigate } from "react-router-dom";
import { useCreateConversation } from "@/hooks/use-create-conversation";
import { toast } from "sonner";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  const { mutate: createConversation, isPending } = useCreateConversation();

  const handleNewChatClick = () => {
    createConversation(undefined, {
      onSuccess: ({ conversationId }) => {
        navigate(`/conversation/${conversationId}`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to create a new conversation.",
        );
      },
    });
  };

  return (
    <Sidebar
      {...props}
      // className="[--sidebar-width:280px]"
    >
      <SidebarHeader className="p-5">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            R
          </div>

          <span className="text-base font-semibold">RAG Chat</span>

          <span className="rounded bg-muted-foreground/20 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            GUEST DEMO
          </span>
        </div>

        {/* New Chat */}
        <SidebarMenu className="mt-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-9 justify-center bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              onClick={handleNewChatClick}
              disabled={isPending}
            >
              <Plus className="size-4" />
              <span>{isPending ? "Creating..." : "New Chat"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-5">
        {/* Conversations */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-0 text-[11px] font-semibold uppercase">
            Conversations
          </SidebarGroupLabel>

          <SidebarMenu>
            <ConversationList />
          </SidebarMenu>
        </SidebarGroup>

        {/* Documents */}
        <SidebarGroup className="mt-auto border-t p-0 pt-4 py-2">
          <div className="mb-2 flex items-center justify-between">
            <SidebarGroupLabel className="p-0 text-[11px] font-semibold uppercase">
              Documents
            </SidebarGroupLabel>

            {/* Upload document */}
            <DocumentUpload variant="ghost" size="xs" className="text-primary hover:text-primary">
              <Upload className="size-3.5" />
              Upload
            </DocumentUpload>
          </div>

          <DocumentList />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-5">
        <UsageIndicator />
      </SidebarFooter>
    </Sidebar>
  );
}
