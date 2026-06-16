import type { ProjectStatus } from "@/data/projects";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Completed: "border-green-500/40 bg-green-500/10 text-green-400",
  "In Progress": "border-sky-500/40 bg-sky-500/10 text-sky-400",
  Planned: "border-amber-500/40 bg-amber-500/10 text-amber-400",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md border px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
