import { Skeleton } from "@/components/ui/skeleton";
import { useUsage } from "@/hooks/use-usage";

const DAILY_QUESTION_LIMIT = 10;
const WARNING_THRESHOLD = 6;

const UsageIndicator = () => {
  const { data: usage, isPending, isError } = useUsage();

  if (isPending) {
    return <div className="space-y-2 group-data-[collapsible=icon]:hidden"><Skeleton className="h-3 w-full rounded-full" /><Skeleton className="h-1.5 w-full rounded-full" /></div>;
  }
  if (isError) return <p className="text-[9px] text-destructive group-data-[collapsible=icon]:hidden">Usage unavailable.</p>;

  const limit = usage.max_limit || DAILY_QUESTION_LIMIT;
  const used = usage.used;
  const percentage = Math.min((used / limit) * 100, 100);
  const isWarning = used >= WARNING_THRESHOLD && used < limit;
  const isLimited = used >= limit;

  return (
    <div className="skim-usage group-data-[collapsible=icon]:hidden">
      <div className="skim-usage-heading">
        <span>Daily questions</span>
        <strong className={isLimited ? "text-destructive" : isWarning ? "text-amber-600 dark:text-amber-400" : ""}>{used} / {limit}</strong>
      </div>
      <div className="skim-usage-track" role="progressbar" aria-label="Daily question usage" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={used}>
        <div
          className="skim-usage-fill"
          style={{
            width: percentage + "%",
            background: isLimited ? "linear-gradient(90deg, #e17b76, #c94f4f)" : isWarning ? "linear-gradient(90deg, #e9b65c, #d88d3b)" : undefined,
          }}
        />
      </div>
      <p className="text-[8px] text-muted-foreground">{isLimited ? "Daily limit reached" : limit - used + " questions remaining today"}</p>
    </div>
  );
};

export default UsageIndicator;