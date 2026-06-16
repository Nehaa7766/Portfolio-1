"use client";

import { ResumePreview } from "./ResumePreview";
import { ResumeOverview } from "./ResumeOverview";

export default function ResumeWindow() {
  return (
    <div className="h-full overflow-auto bg-[#060b16] p-5 font-mono text-zinc-300">
      <div className="flex flex-col gap-6 lg:flex-row">
        <ResumePreview />
        <ResumeOverview />
      </div>
    </div>
  );
}
