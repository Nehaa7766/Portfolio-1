"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/Panel";
import { EXPERIENCE_TABS } from "@/data/experience";
import { ExperienceSidebar } from "./ExperienceSidebar";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { ExperienceTabView } from "./ExperienceTabView";
import { ExperienceStats } from "./ExperienceStats";

export default function ExperienceWindow() {
  const [tab, setTab] = useState("timeline");
  const tabLabel = EXPERIENCE_TABS.find((t) => t.id === tab)?.label ?? "";

  return (
    <div className="flex h-full bg-white text-zinc-600 dark:bg-[#0a0e16] dark:text-zinc-300">
      <ExperienceSidebar activeTab={tab} onTab={setTab} />

      {/* Middle content */}
      <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-auto p-6">
        <SectionLabel>
          {tab === "timeline" ? "Professional Experience" : tabLabel}
        </SectionLabel>
        <div>
          {tab === "timeline" ? (
            <ExperienceTimeline />
          ) : (
            <ExperienceTabView tab={tab} />
          )}
        </div>
      </div>

      <ExperienceStats />
    </div>
  );
}
