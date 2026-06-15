"use client";

import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/store/windowStore";
import { APP_MAP } from "@/constants/apps";
import { Window } from "@/components/window/Window";

/**
 * Renders every open window in z-index order. Minimized windows are removed
 * from the tree (animating out) but remain in the store so the taskbar can
 * restore them.
 */
export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <AnimatePresence>
      {windows
        .filter((w) => !w.isMinimized)
        .map((w) => {
          const AppComponent = APP_MAP[w.appId].component;
          return (
            <Window key={w.id} window={w}>
              <AppComponent />
            </Window>
          );
        })}
    </AnimatePresence>
  );
}
