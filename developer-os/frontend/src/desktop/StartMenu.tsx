"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, Power, User } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { useDesktopStore } from "@/store/desktopStore";
import { APPS } from "@/constants/apps";

/**
 * Windows 11-style Start menu: centered above the taskbar, acrylic surface,
 * a search field, a "Pinned" grid of all applications, and a user/power
 * footer. Selecting an app opens its window and closes the menu.
 */
export function StartMenu() {
  const isOpen = useDesktopStore((s) => s.isStartMenuOpen);
  const closeStartMenu = useDesktopStore((s) => s.closeStartMenu);
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          // Centered horizontally, floating just above the 48px taskbar.
          className="absolute bottom-14 left-1/2 z-[9998] flex w-[min(640px,92vw)] -translate-x-1/2 flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/80"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Search */}
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 dark:border-white/10 dark:bg-zinc-800/70">
            <Search size={16} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search for apps and files"
              className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-500 focus:outline-none dark:text-zinc-100"
            />
          </div>

          {/* Pinned grid */}
          <div>
            <p className="mb-3 px-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Pinned
            </p>
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
              {APPS.map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    type="button"
                    title={app.title}
                    onClick={() => {
                      openWindow(app.id);
                      closeStartMenu();
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Icon size={26} className="text-sky-600 dark:text-sky-300" strokeWidth={1.5} />
                    <span className="w-full truncate text-center text-[11px] text-zinc-700 dark:text-zinc-200">
                      {app.title.replace(/\.(exe|pdf)$/, "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer: user + power */}
          <div className="flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/10">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600">
                <User size={15} className="text-white" />
              </span>
              <span className="text-sm text-zinc-700 dark:text-zinc-100">Developer</span>
            </div>
            <button
              type="button"
              aria-label="Power"
              className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <Power size={17} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
