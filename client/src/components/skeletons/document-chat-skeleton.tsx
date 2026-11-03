import { Skeleton } from "@/components/ui/skeleton";

const DocumentChatSkeleton = () => {
  return (
    <div className="skim-chat-page">
      <div className="skim-chat-scroll">
        <div className="skim-chat-feed">
          <div className="skim-chat-context">
            <span className="skim-chat-context-badge">LOADING YOUR CONVERSATION</span>
          </div>

          <div className="skim-chat-message skim-chat-message-user">
            <Skeleton className="h-3 w-20 self-end rounded-md" />
            <Skeleton className="h-12 w-[68%] rounded-2xl" />
          </div>

          <div className="skim-chat-message skim-chat-message-assistant">
            <div className="flex items-center gap-2">
              <Skeleton className="size-[22px] rounded-lg" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <div className="w-full space-y-3 py-2">
              <Skeleton className="h-4 w-[92%] rounded-md" />
              <Skeleton className="h-4 w-[84%] rounded-md" />
              <Skeleton className="h-4 w-[70%] rounded-md" />
            </div>
          </div>

          <div className="skim-chat-message skim-chat-message-user mt-3">
            <Skeleton className="h-3 w-20 self-end rounded-md" />
            <Skeleton className="h-11 w-[52%] rounded-2xl" />
          </div>

          <div className="skim-chat-message skim-chat-message-assistant">
            <div className="flex items-center gap-2">
              <Skeleton className="size-[22px] rounded-lg" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <div className="w-full space-y-3 py-2">
              <Skeleton className="h-4 w-[88%] rounded-md" />
              <Skeleton className="h-4 w-[75%] rounded-md" />
              <Skeleton className="h-4 w-[55%] rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="skim-composer-area">
        <div className="skim-composer-card">
          <div className="skim-composer-heading">
            <Skeleton className="h-3 w-32 rounded-md" />
            <Skeleton className="h-2.5 w-28 rounded-md" />
          </div>
          <div className="skim-selected-documents">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-6 w-36 rounded-lg" />
          </div>
          <div className="skim-composer-input-row">
            <Skeleton className="h-14 flex-1 rounded-lg" />
            <Skeleton className="size-[38px] rounded-xl" />
          </div>
          <div className="skim-composer-footer">
            <Skeleton className="h-2.5 w-40 rounded-md" />
            <Skeleton className="h-2.5 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentChatSkeleton;