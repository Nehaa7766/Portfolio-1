import {
  User,
  BadgeCheck,
  Crosshair,
  Rocket,
  GraduationCap,
  Activity,
  CalendarDays,
  Code2,
  Clock,
  FolderGit2,
  Layers,
  GitBranch,
  type LucideIcon,
} from "lucide-react";

/** Path to the profile photo in /public (drop your image here). */
export const PROFILE_IMAGE = "/profile.jpg";

export const PROFILE = {
  name: "Neha Shinde",
  role: "Software Engineer",
  location: "India • Pune",
  quote:
    "Building digital solutions and learning every day to create impactful products.",
};

export interface SystemInfoRow {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const SYSTEM_INFO: SystemInfoRow[] = [
  { icon: User, label: "Name", value: "Neha Shinde" },
  { icon: BadgeCheck, label: "Role", value: "Software Engineer" },
  { icon: Crosshair, label: "Focus", value: "Full Stack Development" },
  { icon: Rocket, label: "Current Mission", value: "Building DeveloperOS" },
  { icon: GraduationCap, label: "Experience", value: "Student Developer" },
  { icon: Activity, label: "Status", value: "Learning & Building" },
  { icon: CalendarDays, label: "Operating Since", value: "2024" },
  { icon: Code2, label: "System Version", value: "v1.0.0" },
  { icon: Clock, label: "Uptime", value: "Always Improving" },
];

export interface StatCard {
  icon: LucideIcon;
  value: string;
  label: string;
  accent: string;
}

export const STATS: StatCard[] = [
  { icon: Code2, value: "12+", label: "Projects Built", accent: "#06b6d4" },
  { icon: Layers, value: "20+", label: "Technologies Learned", accent: "#a855f7" },
  { icon: FolderGit2, value: "15+", label: "GitHub Repositories", accent: "#22c55e" },
  { icon: Clock, value: "250+", label: "Coding Hours", accent: "#f59e0b" },
];

export const LEARNING = {
  percent: 75,
  areas: "System Design, Advanced Testing, Performance Optimization",
};

export const PROFILE_BIO: string[] = [
  "I'm a passionate Software Engineer who loves building scalable, user-friendly, and efficient applications. I enjoy turning ideas into real-world solutions through clean code and thoughtful design.",
  "I specialize in full stack development with a strong focus on performance, security, and developer experience.",
  "Always learning. Always building. Always improving.",
];

export interface Objective {
  icon: LucideIcon;
  label: string;
}

export const OBJECTIVES: Objective[] = [
  { icon: Rocket, label: "Master Next.js & React Ecosystem" },
  { icon: Code2, label: "Build DeveloperOS" },
  { icon: Layers, label: "Learn Advanced System Design" },
  { icon: BadgeCheck, label: "Improve Automation Testing" },
  { icon: GitBranch, label: "Contribute to Open Source" },
];
