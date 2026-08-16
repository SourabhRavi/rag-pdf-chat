import { MessageSquare } from "lucide-react";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-conversations";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const ConversationList = () => {
  const { conversationId: activeConversationId } = useParams();
  const { data: conversations = [], isPending, isError } = useConversations();

  const navigate = useNavigate();

  const handleConversationClick = (conversationId: string) => {
    navigate(`/conversation/${conversationId}`);
  };

  if (isPending) {
    return (
      <div className="space-y-2 px-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="pr-2 text-xs text-destructive">Failed to load conversations.</p>;
  }

  if (conversations.length === 0) {
    return <p className="pr-2 text-xs text-muted-foreground">No conversations yet.</p>;
  }

  return (
    <SidebarMenu>
      {conversations.map((conversation) => (
        <SidebarMenuItem key={conversation.conversationId}>
          <SidebarMenuButton
            className={cn(
              "h-9 px-2",
              activeConversationId === conversation.conversationId &&
                "bg-primary/15 hover:bg-primary/20",
            )}
            onClick={() => handleConversationClick(conversation.conversationId)}
          >
            <MessageSquare className="size-4 shrink-0 text-muted-foreground" />

            <span className="min-w-0 flex-1 truncate text-sm">{conversation.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default ConversationList;
