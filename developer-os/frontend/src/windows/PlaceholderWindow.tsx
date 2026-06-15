/**
 * Shared body for every Phase 1 application window.
 * Real content arrives in later phases — for now each app renders a
 * consistent "coming soon" placeholder.
 */
export function PlaceholderWindow({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      <p className="text-xs text-zinc-500">Coming in future phase</p>
    </div>
  );
}
