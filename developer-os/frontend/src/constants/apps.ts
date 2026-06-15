import {
  User,
  FolderGit2,
  Briefcase,
  FileText,
  Mail,
  SquareTerminal,
  Rocket,
  Activity,
  Network,
  GitBranch,
  Brain,
  Code2,
  Bot,
} from "lucide-react";
import type { AppDefinition, AppId } from "@/types/window";

import AboutWindow from "@/windows/About";
import ProjectsWindow from "@/windows/Projects";
import ExperienceWindow from "@/windows/Experience";
import ResumeWindow from "@/windows/Resume";
import ContactWindow from "@/windows/Contact";
import TerminalWindow from "@/windows/Terminal";
import MissionControlWindow from "@/windows/MissionControl";
import LiveMetricsWindow from "@/windows/LiveMetrics";
import ArchitectureExplorerWindow from "@/windows/ArchitectureExplorer";
import DecisionEngineWindow from "@/windows/DecisionEngine";
import MindMapWindow from "@/windows/MindMap";
import CodeReviewSimulatorWindow from "@/windows/CodeReviewSimulator";
import AIAssistantWindow from "@/windows/AIAssistant";

/**
 * The full registry of DeveloperOS applications.
 * Order here drives both desktop icon layout and the start menu.
 */
export const APPS: AppDefinition[] = [
  {
    id: "about",
    title: "About.exe",
    icon: User,
    defaultWidth: 520,
    defaultHeight: 380,
    component: AboutWindow,
  },
  {
    id: "projects",
    title: "Projects.exe",
    icon: FolderGit2,
    defaultWidth: 680,
    defaultHeight: 460,
    component: ProjectsWindow,
  },
  {
    id: "experience",
    title: "Experience.exe",
    icon: Briefcase,
    defaultWidth: 560,
    defaultHeight: 420,
    component: ExperienceWindow,
  },
  {
    id: "resume",
    title: "Resume.pdf",
    icon: FileText,
    defaultWidth: 600,
    defaultHeight: 720,
    component: ResumeWindow,
  },
  {
    id: "contact",
    title: "Contact.exe",
    icon: Mail,
    defaultWidth: 460,
    defaultHeight: 360,
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
    id: "mission-control",
    title: "MissionControl.exe",
    icon: Rocket,
    defaultWidth: 720,
    defaultHeight: 480,
    component: MissionControlWindow,
  },
  {
    id: "live-metrics",
    title: "LiveMetrics.exe",
    icon: Activity,
    defaultWidth: 700,
    defaultHeight: 460,
    component: LiveMetricsWindow,
  },
  {
    id: "architecture-explorer",
    title: "ArchitectureExplorer.exe",
    icon: Network,
    defaultWidth: 760,
    defaultHeight: 520,
    component: ArchitectureExplorerWindow,
  },
  {
    id: "decision-engine",
    title: "DecisionEngine.exe",
    icon: GitBranch,
    defaultWidth: 640,
    defaultHeight: 460,
    component: DecisionEngineWindow,
  },
  {
    id: "mind-map",
    title: "MindMap.exe",
    icon: Brain,
    defaultWidth: 760,
    defaultHeight: 520,
    component: MindMapWindow,
  },
  {
    id: "code-review-simulator",
    title: "CodeReviewSimulator.exe",
    icon: Code2,
    defaultWidth: 720,
    defaultHeight: 520,
    component: CodeReviewSimulatorWindow,
  },
  {
    id: "ai-assistant",
    title: "AIAssistant.exe",
    icon: Bot,
    defaultWidth: 560,
    defaultHeight: 600,
    component: AIAssistantWindow,
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
