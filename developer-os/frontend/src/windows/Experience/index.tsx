"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EXPERIENCE_TABS } from "@/data/experience";
import { ExperienceSidebar } from "./ExperienceSidebar";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { ExperienceTabView } from "./ExperienceTabView";
import { ExperienceStats } from "./ExperienceStats";

export default function ExperienceWindow() {
  const [tab, setTab] = useState("timeline");
  const tabLabel = EXPERIENCE_TABS.find((t) => t.id === tab)?.label ?? "";

  return (
    <div className="flex h-full bg-[#060b16] font-mono text-zinc-300">
      <ExperienceSidebar activeTab={tab} onTab={setTab} />

      {/* Middle content */}
      <div className="min-w-0 flex-1 overflow-auto p-5">
        <SectionHeader className="text-sky-400">
          {tab === "timeline" ? "Professional Experience" : tabLabel}
        </SectionHeader>
        <div className="mt-5">
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
