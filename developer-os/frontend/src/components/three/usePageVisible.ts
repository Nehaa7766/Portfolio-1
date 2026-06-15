"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

/**
 * Tracks tab visibility. Scenes pause their render loop when the tab is
 * hidden so DeveloperOS never burns GPU in a background tab.
 */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => !document.hidden,
    () => true, // server snapshot — assume visible
  );
}
