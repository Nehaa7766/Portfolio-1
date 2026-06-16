import {
  CheckCircle2,
  Layers,
  Brain,
  Clock,
  History,
  Sparkles,
  Trophy,
  Compass,
  type LucideIcon,
} from "lucide-react";

export const TOTAL_EXPERIENCE = {
  title: "Student Developer",
  note: "Actively Learning & Building",
};

export const EXP_QUOTE =
  "Every project is a new experience and every bug is a new lesson.";

export interface TimelineEntry {
  period: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  badge?: string;
}

export const TIMELINE: TimelineEntry[] = [
  {
    period: "2024 - Present",
    title: "Student Developer",
    subtitle: "Personal Projects & Learning",
    description:
      "Building full stack applications, exploring new technologies, and solving real-world problems through code.",
    tags: ["Full Stack Development", "Problem Solving"],
    badge: "Current",
  },
  {
    period: "2024",
    title: "Academic Projects",
    subtitle: "College Projects",
    description:
      "Developed various academic projects using Java, Spring Boot, React, and MySQL.",
    tags: ["Java", "Spring Boot", "React", "MySQL"],
    badge: "6+ Projects",
  },
  {
    period: "2023 - 2024",
    title: "Foundation Building",
    subtitle: "Learning & Exploration",
    description:
      "Focused on data structures, algorithms, OOPs concepts, and web technologies.",
    tags: ["DSA", "OOPs", "HTML/CSS", "JavaScript"],
    badge: "1+ Year",
  },
];

export interface ExperienceStat {
  icon: LucideIcon;
  value: string;
  label: string;
  accent: string;
}

export const EXPERIENCE_STATS: ExperienceStat[] = [
  { icon: CheckCircle2, value: "15+", label: "Projects Completed", accent: "#0ea5e9" },
  { icon: Layers, value: "20+", label: "Technologies Learned", accent: "#a855f7" },
  { icon: Brain, value: "500+", label: "Problems Solved", accent: "#22c55e" },
  { icon: Clock, value: "1000+", label: "Learning Hours", accent: "#f59e0b" },
];

export const CURRENT_FOCUS: string[] = [
  "System Design",
  "Next.js",
  "DevOps",
  "Automation Testing",
];

/** Sidebar tabs and their content. */
export interface ExperienceTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const EXPERIENCE_TABS: ExperienceTab[] = [
  { id: "timeline", label: "Experience Timeline", icon: History },
  { id: "skills", label: "Skills Gained", icon: Sparkles },
  { id: "achievements", label: "Key Achievements", icon: Trophy },
  { id: "journey", label: "Learning Journey", icon: Compass },
];

export const SKILLS_GAINED: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Java", "JavaScript", "TypeScript", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "HTML", "CSS", "Tailwind"] },
  { group: "Backend", items: ["Spring Boot", "Node.js"] },
  { group: "Database", items: ["MySQL", "MongoDB"] },
  { group: "Tools", items: ["Git", "GitHub", "Docker", "Postman", "VS Code"] },
];

export const KEY_ACHIEVEMENTS: string[] = [
  "Solved 500+ DSA problems across multiple platforms",
  "Built 15+ full stack projects from scratch",
  "Active open source contributor",
  "Strong foundation in system design fundamentals",
];

export const LEARNING_JOURNEY: string[] = [
  "Started with core programming and data structures.",
  "Moved into full stack web development with React and Spring Boot.",
  "Now focused on system design, DevOps, and automation testing.",
  "Always learning, always building, always improving.",
];
