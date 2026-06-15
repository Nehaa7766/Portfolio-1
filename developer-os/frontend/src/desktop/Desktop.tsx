"use client";

import { useDesktopStore } from "@/store/desktopStore";
import { APPS } from "@/constants/apps";
import { DesktopBackground } from "./DesktopBackground";
import { DesktopIcon } from "./DesktopIcon";
import { WindowManager } from "./WindowManager";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";

/**
 * Root desktop surface. Hosts the wallpaper, desktop icon grid, window
 * manager, start menu and taskbar.
 */
export function Desktop() {
  const closeStartMenu = useDesktopStore((s) => s.closeStartMenu);

  return (
    <main
      // Full-screen wallpaper.
      className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-zinc-900 to-black select-none"
      // Clicking empty desktop dismisses the start menu.
      onPointerDown={closeStartMenu}
    >
      {/* Ambient 3D wallpaper (behind everything, z-0). */}
      <DesktopBackground />

      {/* Desktop icons — column grid in the top-left. */}
      <div
        className="absolute left-3 top-3 z-10 grid grid-flow-col grid-rows-[repeat(7,minmax(0,1fr))] gap-1"
        // Stop clicks on icons from bubbling up and closing nothing of note;
        // icons handle their own start-menu close.
        onPointerDown={(e) => e.stopPropagation()}
      >
        {APPS.map((app) => (
          <DesktopIcon key={app.id} app={app} />
        ))}
      </div>

      {/* Open windows */}
      <WindowManager />

      {/* Start menu (overlay) */}
      <StartMenu />

      {/* Taskbar */}
      <Taskbar />
    </main>
  );
}
