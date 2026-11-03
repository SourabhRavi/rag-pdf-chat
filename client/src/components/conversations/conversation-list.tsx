import { MessageSquareText } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-conversations";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const ConversationList = () => {
  const { conversationId: activeConversationId } = useParams();
  const { data: conversations = [], isPending, isError } = useConversations();
  const navigate = useNavigate();

  if (isPending) {
    return <div className="space-y-2 px-2"><Skeleton className="h-9 w-full rounded-lg" /><Skeleton className="h-9 w-full rounded-lg" /><Skeleton className="h-9 w-full rounded-lg" /></div>;
  }
  if (isError) return <p className="px-2 py-2 text-[10px] text-destructive">Couldn’t load conversations.</p>;
  if (conversations.length === 0) {
    return <div className="px-2 py-4 text-center"><MessageSquareText className="mx-auto size-4 text-muted-foreground/55" /><p className="mt-2 text-[10px] text-muted-foreground">Your chats will appear here.</p></div>;
  }

  return (
    <SidebarMenu className="skim-conversation-list">
      {conversations.map((conversation) => (
        <SidebarMenuItem key={conversation.conversationId}>
          <SidebarMenuButton
            tooltip={conversation.title}
            isActive={activeConversationId === conversation.conversationId}
            className={cn("skim-conversation-button", activeConversationId === conversation.conversationId && "font-semibold")}
            onClick={() => navigate("/conversation/" + conversation.conversationId)}
          >
            <MessageSquareText className="size-3.5 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left capitalize">{conversation.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default ConversationList;