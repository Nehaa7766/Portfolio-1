import { create } from "zustand";
import type { AppId, Position, Size, WindowInstance } from "@/types/window";
import { APP_MAP } from "@/constants/apps";

/** Height of the taskbar in px — windows avoid overlapping it when maximized. */
export const TASKBAR_HEIGHT = 48;

/** Offset applied to each newly opened window so they cascade nicely. */
const CASCADE_STEP = 28;
const CASCADE_ORIGIN = { x: 96, y: 64 };
const Z_BASE = 10;

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

    const offset = windows.length * CASCADE_STEP;
    const nextZ = topZIndex + 1;
    const newWindow: WindowInstance = {
      id: appId,
      appId,
      title: app.title,
      position: { x: CASCADE_ORIGIN.x + offset, y: CASCADE_ORIGIN.y + offset },
      size: { width: app.defaultWidth, height: app.defaultHeight },
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
