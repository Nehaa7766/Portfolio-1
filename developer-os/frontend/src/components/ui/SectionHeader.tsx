import { cn } from "@/lib/utils";

/**
 * Refined section heading used across DeveloperOS windows: a thin accent bar
 * followed by small, uppercase, letter-spaced text.
 */
export function SectionHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-4 w-[3px] shrink-0 rounded-full bg-sky-500 dark:bg-sky-400/80" />
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        {children}
      </h2>
    </div>
  );
}
