import {
  User,
  FolderGit2,
  Briefcase,
  FileText,
  Mail,
  SquareTerminal,
  Bot,
  Activity,
} from "lucide-react";
import type { AppDefinition, AppId } from "@/types/window";

import AboutWindow from "@/windows/About";
import ProjectsWindow from "@/windows/Projects";
import ExperienceWindow from "@/windows/Experience";
import ResumeWindow from "@/windows/Resume";
import ContactWindow from "@/windows/Contact";
import TerminalWindow from "@/windows/Terminal";
import AIAssistantWindow from "@/windows/AIAssistant";
import LiveUpdateWindow from "@/windows/LiveUpdate";

/**
 * The full registry of DeveloperOS applications.
 * Order here drives both desktop icon layout and the start menu.
 */
export const APPS: AppDefinition[] = [
  {
    id: "about",
    title: "About.exe",
    icon: User,
    defaultWidth: 1200,
    defaultHeight: 820,
    component: AboutWindow,
  },
  {
    id: "projects",
    title: "Projects.exe",
    icon: FolderGit2,
    defaultWidth: 1280,
    defaultHeight: 800,
    component: ProjectsWindow,
  },
  {
    id: "experience",
    title: "Experience.exe",
    icon: Briefcase,
    defaultWidth: 1180,
    defaultHeight: 720,
    component: ExperienceWindow,
  },
  {
    id: "resume",
    title: "Resume.pdf",
    icon: FileText,
    defaultWidth: 1060,
    defaultHeight: 720,
    component: ResumeWindow,
  },
  {
    id: "contact",
    title: "Contact.exe",
    icon: Mail,
    defaultWidth: 1180,
    defaultHeight: 680,
    component: ContactWindow,
  },
  {
    id: "terminal",
    title: "Terminal.exe",
    icon: SquareTerminal,
    defaultWidth: 640,
    defaultHeight: 400,
    component: TerminalWindow,
  },
  {
    id: "ai-assistant",
    title: "AIAssistant.exe",
    icon: Bot,
    defaultWidth: 720,
    defaultHeight: 640,
    component: AIAssistantWindow,
  },
  {
    id: "live-update",
    title: "LiveUpdate.exe",
    icon: Activity,
    defaultWidth: 1080,
    defaultHeight: 720,
    component: LiveUpdateWindow,
  },
];

/** Lookup map for O(1) access by AppId. */
export const APP_MAP: Record<AppId, AppDefinition> = APPS.reduce(
  (acc, app) => {
    acc[app.id] = app;
    return acc;
  },
  {} as Record<AppId, AppDefinition>,
);
