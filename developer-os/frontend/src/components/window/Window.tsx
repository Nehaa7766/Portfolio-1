"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { Minus, Square, X, Copy } from "lucide-react";
import { useWindowStore, TASKBAR_HEIGHT } from "@/store/windowStore";
import { APP_MAP } from "@/constants/apps";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { WindowInstance } from "@/types/window";
import { cn } from "@/lib/utils";

interface WindowProps {
  window: WindowInstance;
  children: ReactNode;
}

/**
 * A reusable OS window: draggable title bar, focus-on-interaction,
 * minimize / maximize / restore / close controls, and Framer Motion
 * open / close animations. The body renders arbitrary content.
 */
export function Window({ window: win, children }: WindowProps) {
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const topZIndex = useWindowStore((s) => s.topZIndex);

  // Drag is driven from the title bar only (not the body) via drag controls.
  const dragControls = useDragControls();

  // x/y motion values double as both the drag transform and the persisted position.
  const x = useMotionValue(win.position.x);
  const y = useMotionValue(win.position.y);

  const isActive = win.zIndex === topZIndex;
  const AppIcon = APP_MAP[win.appId].icon;

  // On phones, windows behave like full-screen apps: no dragging, no
  // free-floating size. Treat as full-screen when maximized OR on mobile.
  const isMobile = useIsMobile();
  const fullScreen = win.isMaximized || isMobile;

  // Keep the transform in sync when position changes externally
  // (e.g. restoring from a maximized state) or when (un)maximizing.
  useEffect(() => {
    if (fullScreen) {
      x.set(0);
      y.set(0);
    } else {
      x.set(win.position.x);
      y.set(win.position.y);
    }
  }, [fullScreen, win.position.x, win.position.y, x, y]);

  const handleToggleMaximize = () => {
    if (win.isMaximized) restoreWindow(win.id);
    else maximizeWindow(win.id);
  };

  return (
    <motion.div
      role="dialog"
      aria-label={win.title}
      className={cn(
        "absolute left-0 top-0 flex flex-col overflow-hidden border shadow-2xl backdrop-blur",
        fullScreen ? "rounded-none" : "rounded-lg",
        "border-zinc-300/80 bg-white/95 dark:border-zinc-700/80 dark:bg-zinc-900/95",
        isActive ? "ring-1 ring-sky-500/40" : "opacity-95",
      )}
      style={{
        x,
        y,
        width: fullScreen ? "100%" : win.size.width,
        height: fullScreen ? `calc(100% - ${TASKBAR_HEIGHT}px)` : win.size.height,
        zIndex: win.zIndex,
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      drag={!fullScreen}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onPointerDownCapture={() => focusWindow(win.id)}
      onDragEnd={() => updatePosition(win.id, { x: x.get(), y: y.get() })}
    >
      {/* Title bar (Win11 caption) */}
      <div
        className={cn(
          "flex h-9 select-none items-stretch justify-between border-b border-black/5 dark:border-white/10",
          isActive
            ? "bg-zinc-100/90 dark:bg-zinc-800/90"
            : "bg-zinc-100/60 dark:bg-zinc-800/60",
        )}
      >
        {/* Drag region: app icon + title */}
        <div
          onPointerDown={(e) => {
            if (!fullScreen) dragControls.start(e);
          }}
          onDoubleClick={handleToggleMaximize}
          className={cn(
            "flex flex-1 items-center gap-2 truncate px-3",
            fullScreen ? "cursor-default" : "cursor-grab active:cursor-grabbing",
          )}
        >
          <AppIcon size={14} className="shrink-0 text-sky-600 dark:text-sky-300" />
          <span className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-100">
            {win.title}
          </span>
        </div>

        {/* Caption buttons: full-height squares, red close (Win11) */}
        <div className="flex items-stretch">
          <button
            type="button"
            aria-label="Minimize"
            onClick={() => minimizeWindow(win.id)}
            className="flex w-11 items-center justify-center text-zinc-500 transition-colors hover:bg-black/10 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <Minus size={15} />
          </button>
          {/* Maximize/restore is meaningless on mobile (always full-screen). */}
          {!isMobile && (
            <button
              type="button"
              aria-label={win.isMaximized ? "Restore" : "Maximize"}
              onClick={handleToggleMaximize}
              className="flex w-11 items-center justify-center text-zinc-500 transition-colors hover:bg-black/10 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              {win.isMaximized ? <Copy size={13} /> : <Square size={12} />}
            </button>
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={() => closeWindow(win.id)}
            className="flex w-11 items-center justify-center text-zinc-500 transition-colors hover:bg-[#c42b1c] hover:text-white dark:text-zinc-300"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Body — dynamic content */}
      <div className="min-h-0 flex-1 overflow-auto text-zinc-700 dark:text-zinc-200">
        {children}
      </div>
    </motion.div>
  );
}
