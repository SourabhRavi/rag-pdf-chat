import { Skeleton } from "@/components/ui/skeleton";

const DocumentChatSkeleton = () => {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col px-6 xl:px-5">
      {/* Messages */}
      <div className="min-h-0 flex flex-1 overflow-hidden py-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 lg:max-w-3xl">
          {/* User message */}
          <div className="ml-auto flex w-full max-w-[80%] flex-col items-end">
            <div className="w-full max-w-full rounded-2xl">
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>

          {/* Assistant message */}
          <div className="mr-auto w-full max-w-[85%]">
            <div className="max-w-[37em] space-y-2 px-2">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>

          {/* User message */}
          <div className="ml-auto flex w-full max-w-[80%] flex-col items-end">
            <div className="w-full max-w-full rounded-2xl flex justify-end">
              <Skeleton className="h-12 w-[70%] self-end rounded-2xl" />
            </div>
          </div>

          {/* Assistant message */}
          <div className="mr-auto w-full max-w-[85%]">
            <div className="max-w-[37em] space-y-2 px-2">
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[50%]" />
            </div>
          </div>

          {/* Reserve the same space as the real fixed composer */}
          <div className="h-52 shrink-0" />
        </div>
      </div>

      {/* Fixed composer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl">
          <div className="w-full rounded-2xl border bg-background shadow-sm">
            {/* Selected documents */}
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              <Skeleton className="h-6 w-28 rounded-sm" />
              <Skeleton className="h-6 w-36 rounded-sm" />
            </div>

            {/* Input */}
            <div className="flex items-end gap-2 p-3">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="size-9 shrink-0 rounded-lg" />
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t px-3 py-2">
              <Skeleton className="h-3 w-32" />
              {/* <Skeleton className="h-3 w-40" /> */}
              <span className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span className="shimmer">Loading conversation...</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 flex w-full justify-center">
          <div className="relative inset-x-0 bottom-0 -z-10 h-10 w-full max-w-3xl bg-background/90" />
        </div>
      </div>
    </div>
  );
};

export default DocumentChatSkeleton;
