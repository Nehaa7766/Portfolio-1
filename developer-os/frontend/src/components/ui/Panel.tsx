import { cn } from "@/lib/utils";

/**
 * Small, refined section label: a thin accent bar + uppercase tracked text.
 * The shared heading style across all DeveloperOS windows.
 */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-4 w-[3px] rounded-full bg-sky-500 dark:bg-sky-400/80" />
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        {children}
      </h2>
    </div>
  );
}

/**
 * The standard card/section surface used to group window content. Pass a
 * `title` to render a {@link SectionLabel} header, or omit it for a bare card.
 */
export function Panel({
  title,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]",
        className,
      )}
    >
      {title && <SectionLabel className="mb-5">{title}</SectionLabel>}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
