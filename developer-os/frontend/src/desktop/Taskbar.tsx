"use client";

import { useEffect, useState } from "react";
import { Wifi, Volume2, BatteryFull, ChevronUp } from "lucide-react";
import type { AppId } from "@/types/window";
import { useWindowStore } from "@/store/windowStore";
import { useDesktopStore } from "@/store/desktopStore";
import { APP_MAP } from "@/constants/apps";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** The 4-pane Windows 11 mark, in the OS accent color. */
function WindowsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" rx="1" fill="#4cc2ff" />
      <rect x="13" y="2" width="9" height="9" rx="1" fill="#4cc2ff" />
      <rect x="2" y="13" width="9" height="9" rx="1" fill="#4cc2ff" />
      <rect x="13" y="13" width="9" height="9" rx="1" fill="#4cc2ff" />
    </svg>
  );
}

/** Win11-style tray clock: time over date, right-aligned. */
function TrayClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Deferred initial set (avoids SSR hydration mismatch + synchronous
    // setState in the effect body), then tick each minute.
    const raf = requestAnimationFrame(() => setNow(new Date()));
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex min-w-[64px] flex-col items-end text-[11px] leading-tight text-zinc-700 dark:text-zinc-100">
      <span>
        {now
          ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "--:--"}
      </span>
      <span>
        {now
          ? now.toLocaleDateString([], {
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })
          : "--/--/----"}
      </span>
    </div>
  );
}

export function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const topZIndex = useWindowStore((s) => s.topZIndex);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);

  const isStartMenuOpen = useDesktopStore((s) => s.isStartMenuOpen);
  const toggleStartMenu = useDesktopStore((s) => s.toggleStartMenu);

  const handleTaskbarClick = (id: AppId) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      restoreWindow(id);
      focusWindow(id);
    } else if (win.zIndex === topZIndex) {
      // Active window clicked → minimize (Win11 behavior).
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <footer
      className="absolute inset-x-0 bottom-0 z-[9999] h-12 border-t border-black/10 bg-white/60 backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/70"
      // Don't let taskbar clicks bubble to the desktop (which closes the menu).
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Centered app group: Start + running windows */}
      <div className="absolute left-1/2 top-0 flex h-full max-w-[62vw] -translate-x-1/2 items-center gap-1 overflow-x-auto [scrollbar-width:none] sm:max-w-none [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          aria-label="Start"
          onClick={toggleStartMenu}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
            isStartMenuOpen
              ? "bg-black/10 dark:bg-white/15"
              : "hover:bg-black/10 dark:hover:bg-white/10",
          )}
        >
          <WindowsLogo className="h-5 w-5" />
        </button>

        {windows.map((w) => {
          const Icon = APP_MAP[w.appId].icon;
          const isActive = !w.isMinimized && w.zIndex === topZIndex;
          return (
            <button
              key={w.id}
              type="button"
              title={w.title}
              onClick={() => handleTaskbarClick(w.id)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                isActive
                  ? "bg-black/10 dark:bg-white/15"
                  : "hover:bg-black/10 dark:hover:bg-white/10",
              )}
            >
              <Icon size={18} className="text-sky-600 dark:text-sky-300" />
              {/* Running-app underline indicator (longer when active). */}
              <span
                className={cn(
                  "absolute bottom-0.5 h-0.5 rounded-full bg-sky-500 transition-all dark:bg-sky-400",
                  isActive ? "w-4" : "w-1.5 bg-zinc-400 group-hover:bg-sky-400 dark:group-hover:bg-sky-300",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* System tray */}
      <div className="absolute right-1 top-0 flex h-full items-center gap-2 pr-1 text-zinc-600 dark:text-zinc-200">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Show hidden icons"
          className="hidden rounded p-1.5 hover:bg-black/10 sm:block dark:hover:bg-white/10"
        >
          <ChevronUp size={14} />
        </button>
        <div className="hidden items-center gap-2 rounded-md px-2 py-1 hover:bg-black/10 sm:flex dark:hover:bg-white/10">
          <Wifi size={15} />
          <Volume2 size={15} />
          <BatteryFull size={16} />
        </div>
        <div className="rounded-md px-2 py-1 hover:bg-black/10 dark:hover:bg-white/10">
          <TrayClock />
        </div>
      </div>
    </footer>
  );
}
