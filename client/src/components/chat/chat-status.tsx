export const StreamingStatus = ({ status }: { status: string | null }) => {
  if (!status) {
    return null;
  }

  const message = status === "searching" ? "Searching your documents..." : "Generating answer...";

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground px-3">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>

      <span>{message}</span>
    </div>
  );
};
