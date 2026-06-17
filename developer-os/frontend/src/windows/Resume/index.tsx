"use client";

import { ResumePreview } from "./ResumePreview";
import { ResumeOverview } from "./ResumeOverview";

export default function ResumeWindow() {
  return (
    <div className="min-h-full bg-white p-6 text-zinc-600 dark:bg-[#0a0e16] dark:text-zinc-300">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-zinc-200 pb-8 dark:border-white/[0.06]">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Resume
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            A snapshot of my background, skills, and experience. Preview the
            document or download the full PDF.
          </p>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <ResumePreview />
          <ResumeOverview />
        </div>
      </div>
    </div>
  );
}
