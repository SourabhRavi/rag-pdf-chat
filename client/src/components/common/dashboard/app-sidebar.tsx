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
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/assets/logo/skim-logo-svg.svg?react";
import WordMark from "@/assets/logo/skim-wordmark-svg.svg?react";

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

  const handleGotoDashboard = () => {
    navigate("dashboard");
  };

  return (
    <Sidebar
      {...props}
      // className="[--sidebar-width:280px]"
    >
      <SidebarHeader className="p-5">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleGotoDashboard}
            className="flex min-w-0 items-center gap-1.5 cursor-pointer"
          >
            <div className="flex size-10 shrink-0 items-center justify-center">
              <Logo className="size-8 text-foreground" />
            </div>

            <WordMark className="h-5 w-auto object-contain text-foreground" />
          </button>

          <span className="shrink-0 rounded-md border border-muted-foreground/25 bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground">
            GUEST DEMO
          </span>
        </div>

        {/* New Chat */}
        <SidebarMenu className="mt-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              role="button"
              className="h-9 justify-center bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary active:text-primary-foreground"
              onClick={handleNewChatClick}
              disabled={isPending}
            >
              {isPending ? <Spinner /> : <Plus className="size-4" />}
              <span>{isPending ? "Creating..." : "New Chat"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-5 overflow-hidden">
        {/* Conversations */}
        <SidebarGroup className="p-0 flex flex-col flex-1 min-h-0">
          <SidebarGroupLabel className="px-0 text-[11px] font-semibold uppercase">
            Conversations
          </SidebarGroupLabel>

          <SidebarMenu className="scroll-fade scrollbar-none min-h-0 flex-1 overflow-y-auto">
            <ConversationList />
          </SidebarMenu>
        </SidebarGroup>

        {/* Documents */}
        <SidebarGroup className="mt-4 border-t p-0 pt-4 py-2 h-60 shrink-0 flex-col">
          <div className="mb-2 flex shrink-0 items-center justify-between">
            <SidebarGroupLabel className="p-0 text-[11px] font-semibold uppercase">
              Documents
            </SidebarGroupLabel>

            {/* Upload document */}
            <DocumentUpload
              variant="secondary"
              size="xs"
              className="text-primary dark:bg-sidebar-primary/25 hover:text-white dark:text-primary-foreground hover:bg-primary dark:hover:bg-primary "
            >
              <Upload className="size-3.5" />
              Upload
            </DocumentUpload>
          </div>

          <div className="scroll-fade scrollbar-none min-h-0 flex-1 overflow-y-auto">
            <DocumentList />
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-5">
        <UsageIndicator />
      </SidebarFooter>
    </Sidebar>
  );
}
