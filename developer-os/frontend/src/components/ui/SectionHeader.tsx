import { cn } from "@/lib/utils";

/**
 * The `// SECTION TITLE` header used across DeveloperOS windows.
 */
export function SectionHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400",
        className,
      )}
    >
      {"// "}
      {children}
    </h2>
  );
}
