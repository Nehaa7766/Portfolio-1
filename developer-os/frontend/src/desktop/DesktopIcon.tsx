"use client";

import { useState } from "react";
import type { AppDefinition } from "@/types/window";
import { useWindowStore } from "@/store/windowStore";
import { useDesktopStore } from "@/store/desktopStore";
import { cn } from "@/lib/utils";

/**
 * A single desktop icon. A single click opens the associated application
 * window (reliable launcher behavior — no flaky native double-click), and
 * dismisses the start menu if it is open.
 */
export function DesktopIcon({ app }: { app: AppDefinition }) {
  const [selected, setSelected] = useState(false);
  const openWindow = useWindowStore((s) => s.openWindow);
  const closeStartMenu = useDesktopStore((s) => s.closeStartMenu);
  const Icon = app.icon;

  return (
    <button
      type="button"
      onClick={() => {
        setSelected(true);
        closeStartMenu();
        openWindow(app.id);
      }}
      onBlur={() => setSelected(false)}
      className={cn(
        "flex w-20 flex-col items-center gap-1 rounded p-2 text-center transition-colors",
        "hover:bg-sky-400/10 focus:outline-none active:scale-95",
        selected && "bg-sky-500/25 ring-1 ring-sky-400/40",
      )}
    >
      <Icon className="h-8 w-8 text-sky-300" strokeWidth={1.5} />
      <span className="w-full break-words text-[11px] leading-tight text-zinc-100 drop-shadow">
        {app.title}
      </span>
    </button>
  );
}
