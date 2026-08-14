import * as React from "react";
import { Plus, MessageSquare, Upload } from "lucide-react";

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

import { useDocuments } from "@/hooks/use-documents";
import DocumentList from "@/components/documents/document-list";

const conversations = [
  {
    title: "Understanding RAG Architecture",
    time: "10m",
  },
  {
    title: "Vector Database Comparison",
    time: "1h",
  },
  {
    title: "Fine-tuning vs RAG tradeoffs",
    time: "1d",
  },
  {
    title: "PDF Semantic Search Setup",
    time: "1d",
  },
  {
    title: "Chunking Strategy & Overlap",
    time: "4d",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: documents = [], isPending, isError } = useDocuments();

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

          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            GUEST DEMO
          </span>
        </div>

        {/* New Chat */}
        <SidebarMenu className="mt-3">
          <SidebarMenuItem>
            <SidebarMenuButton className="h-9 justify-center bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
              <Plus className="size-4" />
              <span>New Chat</span>
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
            {conversations.map((conversation) => (
              <SidebarMenuItem key={conversation.title}>
                <SidebarMenuButton className="h-9 px-2">
                  <MessageSquare className="size-4 text-muted-foreground" />

                  <span className="min-w-0 flex-1 truncate text-sm">{conversation.title}</span>

                  <span className="text-[11px] text-muted-foreground">{conversation.time}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Documents */}
        <SidebarGroup className="mt-auto border-t p-0 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <SidebarGroupLabel className="p-0 text-[11px] font-semibold uppercase">
              Documents
            </SidebarGroupLabel>

            <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <Upload className="size-3.5" />
              Upload
            </button>
          </div>

          <DocumentList documents={documents} isPending={isPending} isError={isError} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Usage Limit</span>

            <span className="font-semibold">7 / 10 questions today</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[70%] rounded-full bg-primary" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
