import { MessageSquareText, AlertCircle } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-conversations";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const ConversationList = () => {
  const { conversationId: activeConversationId } = useParams();
  const { data: conversations = [], isPending, isError } = useConversations();
  const navigate = useNavigate();

  if (isPending) {
    return (
      <SidebarMenu className="skim-conversation-list">
        {[0, 1, 2].map((item) => (
          <SidebarMenuItem key={item}>
            <SidebarMenuButton disabled className="skim-conversation-button">
              <Skeleton className="size-4 shrink-0 rounded" />
              <span className="min-w-0 flex-1">
                <Skeleton className="h-3 w-28 rounded" />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (isError) {
    return (
      <SidebarMenu className="skim-conversation-list">
        <SidebarMenuItem>
          <SidebarMenuButton disabled tooltip="Conversations couldn't be loaded">
            <AlertCircle className="size-4 shrink-0" />
            <span>Unavailable</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (conversations.length === 0) {
    return (
      <SidebarMenu className="skim-conversation-list">
        <SidebarMenuItem>
          <SidebarMenuButton disabled tooltip="Your chats will appear here">
            <MessageSquareText className="size-4 shrink-0" />
            <span>No conversations yet</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu className="skim-conversation-list">
      {conversations.map((conversation) => (
        <SidebarMenuItem key={conversation.conversationId}>
          <SidebarMenuButton
            tooltip={conversation.title}
            isActive={activeConversationId === conversation.conversationId}
            className={cn(
              "skim-conversation-button",
              activeConversationId === conversation.conversationId && "font-semibold",
            )}
            onClick={() => navigate("/conversation/" + conversation.conversationId)}
          >
            <MessageSquareText className="size-3.5 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left capitalize">
              {conversation.title}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default ConversationList;