import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Unique identifier for each registered application.
 * Doubles as the window instance id since Phase 1 treats every app as a
 * singleton window (opening an already-open app focuses it instead).
 */
export type AppId =
  | "about"
  | "projects"
  | "experience"
  | "resume"
  | "contact"
  | "terminal"
  | "ai-assistant"
  | "live-update";

/** A point in desktop space (px), used as the window's translate offset. */
export interface Position {
  x: number;
  y: number;
}

/** Pixel dimensions of a window. */
export interface Size {
  width: number;
  height: number;
}

/**
 * Static definition of an application as listed on the desktop / start menu.
 * Lives in `constants/apps.ts`.
 */
export interface AppDefinition {
  id: AppId;
  /** Display name shown on the icon, title bar and taskbar (e.g. "About.exe"). */
  title: string;
  /** lucide-react icon component rendered for the app. */
  icon: LucideIcon;
  defaultWidth: number;
  defaultHeight: number;
  /** The React component rendered inside the window body. */
  component: ComponentType;
}

/**
 * A live window currently tracked by the window manager.
 */
export interface WindowInstance {
  /** Equal to the AppId (singleton-per-app model). */
  id: AppId;
  appId: AppId;
  title: string;
  position: Position;
  size: Size;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  /** Saved normal bounds so a maximized window can be restored. */
  prevBounds?: { position: Position; size: Size };
}
