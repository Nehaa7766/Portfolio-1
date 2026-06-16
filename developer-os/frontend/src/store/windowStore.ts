import { create } from "zustand";
import type { AppId, Position, Size, WindowInstance } from "@/types/window";
import { APP_MAP } from "@/constants/apps";

/** Height of the taskbar in px — windows avoid overlapping it when maximized. */
export const TASKBAR_HEIGHT = 48;

/** Offset applied to each newly opened window so they cascade nicely. */
const CASCADE_STEP = 28;
const Z_BASE = 10;
/** Minimum gap kept between a window and the viewport edges. */
const VIEWPORT_MARGIN = 8;

/**
 * Compute a centered, viewport-clamped position + size for a new window so a
 * large default size never opens off-screen or under the taskbar. A small
 * per-window cascade offset keeps stacked windows distinguishable.
 */
function placeWindow(
  defaultWidth: number,
  defaultHeight: number,
  index: number,
): { position: Position; size: Size } {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh =
    (typeof window !== "undefined" ? window.innerHeight : 900) - TASKBAR_HEIGHT;

  const width = Math.min(defaultWidth, vw - VIEWPORT_MARGIN * 2);
  const height = Math.min(defaultHeight, vh - VIEWPORT_MARGIN * 2);

  const offset = (index % 6) * CASCADE_STEP;
  const clamp = (v: number, max: number) =>
    Math.max(VIEWPORT_MARGIN, Math.min(v, max - VIEWPORT_MARGIN));

  return {
    size: { width, height },
    position: {
      x: clamp(Math.round((vw - width) / 2) - 60 + offset, vw - width),
      y: clamp(Math.round((vh - height) / 2) - 40 + offset, vh - height),
    },
  };
}

interface WindowStore {
  windows: WindowInstance[];
  /** Highest z-index currently assigned; incremented on every focus. */
  topZIndex: number;

  openWindow: (appId: AppId) => void;
  closeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  restoreWindow: (id: AppId) => void;
  updatePosition: (id: AppId, position: Position) => void;
  updateSize: (id: AppId, size: Size) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  topZIndex: Z_BASE,

  openWindow: (appId) => {
    const { windows, topZIndex } = get();
    const existing = windows.find((w) => w.id === appId);

    // Singleton-per-app: re-opening focuses (and un-minimizes) the existing window.
    if (existing) {
      const nextZ = topZIndex + 1;
      set({
        topZIndex: nextZ,
        windows: windows.map((w) =>
          w.id === appId ? { ...w, isMinimized: false, zIndex: nextZ } : w,
        ),
      });
      return;
    }

    const app = APP_MAP[appId];
    if (!app) return;

    const nextZ = topZIndex + 1;
    const { position, size } = placeWindow(
      app.defaultWidth,
      app.defaultHeight,
      windows.length,
    );
    const newWindow: WindowInstance = {
      id: appId,
      appId,
      title: app.title,
      position,
      size,
      zIndex: nextZ,
      isMinimized: false,
      isMaximized: false,
    };

    set({ topZIndex: nextZ, windows: [...windows, newWindow] });
  },

  closeWindow: (id) =>
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),

  focusWindow: (id) => {
    const { windows, topZIndex } = get();
    const target = windows.find((w) => w.id === id);
    // Already on top — nothing to do (avoids needless re-renders / z-index growth).
    if (!target || target.zIndex === topZIndex) return;

    const nextZ = topZIndex + 1;
    set({
      topZIndex: nextZ,
      windows: windows.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w)),
    });
  },

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w,
      ),
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMaximized: true,
              // Remember normal bounds so restore can return to them.
              prevBounds: { position: w.position, size: w.size },
            }
          : w,
      ),
    })),

  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;
        // Restore clears both minimized and maximized states.
        const restored: WindowInstance = {
          ...w,
          isMinimized: false,
          isMaximized: false,
        };
        if (w.prevBounds) {
          restored.position = w.prevBounds.position;
          restored.size = w.prevBounds.size;
          restored.prevBounds = undefined;
        }
        return restored;
      }),
    })),

  updatePosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w,
      ),
    })),

  updateSize: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    })),
}));
