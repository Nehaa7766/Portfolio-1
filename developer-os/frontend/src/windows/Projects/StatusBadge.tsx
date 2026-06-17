import type { ProjectStatus } from "@/data/projects";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Completed:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/20 dark:text-emerald-300",
  "In Progress":
    "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:border-sky-400/20 dark:text-sky-300",
  Planned:
    "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:border-amber-400/20 dark:text-amber-300",
};

const DOT_STYLES: Record<ProjectStatus, string> = {
  Completed: "bg-emerald-500 dark:bg-emerald-400",
  "In Progress": "bg-sky-500 dark:bg-sky-400",
  Planned: "bg-amber-500 dark:bg-amber-400",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        STATUS_STYLES[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_STYLES[status])} />
      {status}
    </span>
  );
}
