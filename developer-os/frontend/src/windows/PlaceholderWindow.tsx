import { Construction } from "lucide-react";

/**
 * Shared body for application windows whose real content isn't built yet.
 * Renders a consistent, professional "coming soon" placeholder.
 */
export function PlaceholderWindow({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-white p-8 text-center dark:bg-[#0a0e16]">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
        <Construction size={24} />
      </span>
      <div>
        <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </p>
        <p className="mt-1 text-sm text-zinc-500">This app is under construction.</p>
      </div>
    </div>
  );
}
