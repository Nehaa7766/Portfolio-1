"use client";

import { useSyncExternalStore } from "react";

/** Matches the Tailwind `md` breakpoint (mobile = below 768px). */
const QUERY = "(max-width: 767px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * True on phone-sized viewports. SSR-safe (assumes desktop on the server)
 * and updates live on resize/orientation change.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
