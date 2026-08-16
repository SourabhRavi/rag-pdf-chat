import { Skeleton } from "@/components/ui/skeleton";
import { useUsage } from "@/hooks/use-usage";

const DAILY_QUESTION_LIMIT = 10;
const WARNING_THRESHOLD = 6;

const UsageIndicator = () => {
  const { data: usage, isPending, isError } = useUsage();

  if (isPending) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Usage Limit</span>

          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="h-1.5 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-xs text-destructive">Failed to load usage.</p>;
  }

  const used = usage.used;
  const percentage = Math.min((used / DAILY_QUESTION_LIMIT) * 100, 100);

  const usageColor =
    used >= DAILY_QUESTION_LIMIT
      ? "bg-destructive"
      : used >= 6
        ? "bg-orange-500 dark:bg-orange-400"
        : "bg-primary";

  const progressColor =
    used >= DAILY_QUESTION_LIMIT
      ? "text-destructive"
      : used >= WARNING_THRESHOLD
        ? "text-orange-500 dark:text-orange-400"
        : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Usage Limit</span>

        <span className={`font-semibold ${progressColor}`}>
          {used} / {DAILY_QUESTION_LIMIT} questions today
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted-foreground/20"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={DAILY_QUESTION_LIMIT}
        aria-valuenow={used}
      >
        <div
          className={`h-full rounded-full transition-[width,background-color] ${usageColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default UsageIndicator;
