/**
 * Command registry for the DeveloperOS terminal. Each command returns an
 * array of {@link Line}s (synchronously, or via a Promise for the AI / GitHub
 * commands). Side effects (clear screen, change directory) go through the
 * {@link CommandContext}.
 */
import type { GithubStats } from "@/types/github";
import { TIMELINE, TOTAL_EXPERIENCE } from "@/data/experience";
import { RESUME } from "@/data/resume";
import type { Line, CommandSpec } from "./types";
import {
  IDENTITY,
  CORE_SKILLS,
  EDUCATION,
  TERMINAL_PROJECTS,
  TERMINAL_STATS,
  CONTACTS,
  ROADMAP,
  TERMINAL_VERSION,
  WINDOWS_VERSION,
} from "./content";
import {
  nodeAt,
  resolvePath,
  pathLabel,
  treeLines,
  ROOT_LABEL,
  type DirNode,
} from "./filesystem";

const DIVIDER: Line = { text: "─".repeat(44), tone: "comment" };
const blank: Line = { text: "" };

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

async function getGithub(): Promise<GithubStats> {
  const res = await fetch(`/api/github`, { cache: "no-store" });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `GitHub request failed (${res.status}).`);
  }
  return (await res.json()) as GithubStats;
}

function errorLines(message: string): Line[] {
  return [{ text: message, tone: "error" }];
}

// ── Command implementations ──────────────────────────────────────────────

const SPECS: CommandSpec[] = [
  // PROFILE ────────────────────────────────────────────────────────────
  {
    name: "whoami",
    summary: "Print identity and headline skills",
    category: "PROFILE",
    run: () => [
      { text: IDENTITY.name, tone: "heading" },
      ...IDENTITY.titles.map((t) => ({ text: t, tone: "accent" as const })),
      blank,
      { text: "Specializing in:", tone: "muted" },
      ...CORE_SKILLS.map((s) => ({ text: `  - ${s}`, tone: "default" as const })),
    ],
  },
  {
    name: "skills",
    summary: "List the core tech stack",
    category: "PROFILE",
    run: () => [
      { text: "Core stack", tone: "heading" },
      ...CORE_SKILLS.map((s) => ({ text: `  • ${s}`, tone: "default" as const })),
    ],
  },
  {
    name: "experience",
    summary: "Show the experience timeline",
    category: "PROFILE",
    run: () => {
      const out: Line[] = [
        { text: `${TOTAL_EXPERIENCE.title} — ${TOTAL_EXPERIENCE.note}`, tone: "heading" },
        blank,
      ];
      TIMELINE.forEach((e, i) => {
        out.push({ text: e.period, tone: "muted" });
        out.push({ text: e.title, tone: "default" });
        out.push({ text: `  ${e.subtitle}`, tone: "accent" });
        out.push({ text: `  ${e.description}`, tone: "muted" });
        if (i < TIMELINE.length - 1) out.push(blank);
      });
      return out;
    },
  },
  {
    name: "education",
    summary: "Show education details",
    category: "PROFILE",
    run: () => [
      { text: `${EDUCATION.degree} — ${EDUCATION.field}`, tone: "heading" },
      { text: EDUCATION.university, tone: "default" },
      { text: EDUCATION.years, tone: "muted" },
    ],
  },
  {
    name: "resume",
    summary: "Resume summary and download link",
    category: "PROFILE",
    run: () => [
      { text: `${RESUME.name} — ${RESUME.role}`, tone: "heading" },
      { text: `File: ${RESUME.fileName}  (${RESUME.format}, ${RESUME.size})`, tone: "muted" },
      { text: `Last updated: ${RESUME.lastUpdated}`, tone: "muted" },
      blank,
      { text: `Download → ${RESUME.downloadHref}`, tone: "accent", href: RESUME.downloadHref },
    ],
  },
  {
    name: "contact",
    summary: "Show contact channels",
    category: "PROFILE",
    run: () =>
      CONTACTS.map((c) => ({
        text: `${c.label.padEnd(10)} ${c.value}`,
        tone: "default" as const,
        href: c.href,
      })),
  },

  // PROJECTS ───────────────────────────────────────────────────────────
  {
    name: "projects",
    summary: "List all projects",
    category: "PROJECTS",
    run: () => {
      const out: Line[] = [];
      TERMINAL_PROJECTS.forEach((p, i) => {
        out.push({ text: `[${p.index}] ${p.name}`, tone: "heading" });
        out.push({ text: `     ${p.tagline}`, tone: "muted" });
        if (i < TERMINAL_PROJECTS.length - 1) out.push(blank);
      });
      out.push(DIVIDER);
      out.push({ text: 'Run "project <name>" for details, e.g. project hms', tone: "comment" });
      return out;
    },
  },
  {
    name: "project",
    summary: "Show details for one project",
    usage: "project <developeros|hms|ess|rawmix>",
    category: "PROJECTS",
    run: ({ args }) => {
      const key = (args[0] ?? "").toLowerCase();
      if (!key) {
        return [
          { text: "Usage: project <name>", tone: "warn" },
          { text: `Available: ${TERMINAL_PROJECTS.map((p) => p.key).join(", ")}`, tone: "muted" },
        ];
      }
      const p = TERMINAL_PROJECTS.find((x) => x.key === key);
      if (!p) {
        return [
          { text: `Unknown project: ${key}`, tone: "error" },
          { text: `Available: ${TERMINAL_PROJECTS.map((x) => x.key).join(", ")}`, tone: "muted" },
        ];
      }
      return [
        { text: `[${p.index}] ${p.name}`, tone: "heading" },
        { text: p.tagline, tone: "accent" },
        { text: `Status: ${p.status}`, tone: "muted" },
        { text: `Stack:  ${p.stack.join(", ")}`, tone: "muted" },
        blank,
        ...p.highlights.map((h) => ({ text: `  - ${h}`, tone: "default" as const })),
      ];
    },
  },

  // SYSTEM ─────────────────────────────────────────────────────────────
  {
    name: "version",
    summary: "Show terminal version",
    category: "SYSTEM",
    run: () => [
      { text: `DeveloperOS Terminal v${TERMINAL_VERSION}`, tone: "heading" },
      { text: `Microsoft Windows [Version ${WINDOWS_VERSION}]`, tone: "muted" },
    ],
  },
  {
    name: "stats",
    summary: "Show developer statistics",
    category: "SYSTEM",
    run: () =>
      TERMINAL_STATS.map((s) => ({
        text: `${(s.label + ":").padEnd(24)} ${s.value}`,
        tone: "default" as const,
      })),
  },
  {
    name: "date",
    summary: "Print the current date and time",
    category: "SYSTEM",
    run: () => [{ text: new Date().toString(), tone: "default" }],
  },
  {
    name: "uptime",
    summary: "Show session uptime",
    category: "SYSTEM",
    run: ({ uptimeSeconds }) => {
      const s = uptimeSeconds();
      const mm = Math.floor(s / 60);
      const ss = s % 60;
      return [{ text: `Session up ${mm}m ${ss}s`, tone: "default" }];
    },
  },
  {
    name: "clear",
    summary: "Clear the screen",
    category: "SYSTEM",
    run: ({ clearScreen }) => {
      clearScreen();
      return [];
    },
  },
  {
    name: "echo",
    summary: "Print text back",
    usage: "echo <text>",
    category: "SYSTEM",
    run: ({ argline }) => [{ text: argline, tone: "default" }],
  },

  // AI ─────────────────────────────────────────────────────────────────
  {
    name: "ask",
    summary: "Ask the AI assistant a question",
    usage: "ask <question>",
    category: "AI",
    run: async ({ argline }) => {
      const question = argline.trim();
      if (!question) return [{ text: "Usage: ask <question>", tone: "warn" }];
      try {
        const res = await fetch(`/api/ai/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question, history: [] }),
        });
        const data = (await res.json().catch(() => null)) as
          | { answer?: string; error?: string }
          | null;
        if (!res.ok || !data?.answer) {
          return errorLines(data?.error ?? `AI request failed (${res.status}).`);
        }
        return data.answer.split("\n").map((t) => ({ text: t, tone: "default" as const }));
      } catch {
        return errorLines("Could not reach the AI service. Check your connection.");
      }
    },
  },
  {
    name: "interview",
    summary: "Sample mock-interview questions",
    category: "AI",
    run: () => [
      { text: "Mock interview — sample questions", tone: "heading" },
      blank,
      { text: "1. Walk me through the architecture of DeveloperOS.", tone: "default" },
      { text: "2. How do you structure a Spring Boot service layer?", tone: "default" },
      { text: "3. Describe a bug you debugged end to end.", tone: "default" },
      { text: "4. How do you approach writing automated tests?", tone: "default" },
      { text: "5. How would you scale a multi-tenant platform?", tone: "default" },
      DIVIDER,
      { text: 'Tip: run "ask <question>" to get a live answer.', tone: "comment" },
    ],
  },
  {
    name: "roadmap",
    summary: "Show the learning roadmap",
    category: "AI",
    run: () => {
      const out: Line[] = [{ text: "Learning roadmap", tone: "heading" }, blank];
      ROADMAP.forEach((phase) => {
        out.push({ text: phase.phase, tone: "accent" });
        phase.items.forEach((i) => out.push({ text: `  - ${i}`, tone: "default" }));
        out.push(blank);
      });
      out.pop();
      return out;
    },
  },
  {
    name: "review-code",
    summary: "Show a sample code-review checklist",
    category: "AI",
    run: () => [
      { text: "Code review checklist", tone: "heading" },
      blank,
      { text: "  [✓] Correctness — does it handle edge cases?", tone: "default" },
      { text: "  [✓] Readability — clear names, small functions", tone: "default" },
      { text: "  [✓] Tests — meaningful coverage of behavior", tone: "default" },
      { text: "  [✓] Security — input validation, no secrets in code", tone: "default" },
      { text: "  [✓] Performance — no needless work in hot paths", tone: "default" },
      DIVIDER,
      { text: 'Tip: run "ask review this snippet: ..." for a live review.', tone: "comment" },
    ],
  },

  // GITHUB ─────────────────────────────────────────────────────────────
  {
    name: "github",
    summary: "Show the GitHub profile summary",
    category: "GITHUB",
    run: async () => {
      try {
        const s = await getGithub();
        return [
          { text: `${s.profile.name ?? s.profile.login} (@${s.profile.login})`, tone: "heading" },
          ...(s.profile.bio ? [{ text: s.profile.bio, tone: "muted" as const }] : []),
          blank,
          { text: `Public repos: ${s.profile.publicRepos}`, tone: "default" },
          { text: `Followers:    ${s.profile.followers}`, tone: "default" },
          { text: `Following:    ${s.profile.following}`, tone: "default" },
          { text: `Total stars:  ${s.totalStars}`, tone: "default" },
          blank,
          { text: s.profile.htmlUrl, tone: "accent", href: s.profile.htmlUrl },
        ];
      } catch (e) {
        return errorLines(e instanceof Error ? e.message : "Failed to load GitHub data.");
      }
    },
  },
  {
    name: "repos",
    summary: "List top repositories",
    category: "GITHUB",
    run: async () => {
      try {
        const s = await getGithub();
        if (s.repos.length === 0) return [{ text: "No public repositories yet.", tone: "muted" }];
        const out: Line[] = [{ text: "Top repositories", tone: "heading" }, blank];
        s.repos.forEach((r) => {
          out.push({ text: r.name, tone: "accent", href: r.htmlUrl });
          out.push({
            text: `  ★ ${r.stars}  ⑂ ${r.forks}${r.language ? `  ·  ${r.language}` : ""}`,
            tone: "muted",
          });
          if (r.description) out.push({ text: `  ${r.description}`, tone: "default" });
        });
        return out;
      } catch (e) {
        return errorLines(e instanceof Error ? e.message : "Failed to load repositories.");
      }
    },
  },
  {
    name: "commits",
    summary: "Show recent activity",
    category: "GITHUB",
    run: async () => {
      try {
        const s = await getGithub();
        if (s.activity.length === 0) return [{ text: "No recent public activity.", tone: "muted" }];
        const out: Line[] = [{ text: "Recent activity", tone: "heading" }, blank];
        s.activity.slice(0, 8).forEach((a) => {
          out.push({ text: a.text, tone: "default" });
          out.push({ text: `  ${a.repo} · ${relativeTime(a.createdAt)}`, tone: "muted" });
        });
        return out;
      } catch (e) {
        return errorLines(e instanceof Error ? e.message : "Failed to load activity.");
      }
    },
  },
  {
    name: "contributions",
    summary: "Show a contribution snapshot",
    category: "GITHUB",
    run: async () => {
      try {
        const s = await getGithub();
        return [
          { text: "Contribution snapshot", tone: "heading" },
          blank,
          { text: `Public repositories: ${s.profile.publicRepos}`, tone: "default" },
          { text: `Total stars earned:  ${s.totalStars}`, tone: "default" },
          { text: `Recent events:       ${s.activity.length}`, tone: "default" },
          blank,
          { text: `Full graph → ${s.profile.htmlUrl}`, tone: "accent", href: s.profile.htmlUrl },
        ];
      } catch (e) {
        return errorLines(e instanceof Error ? e.message : "Failed to load contributions.");
      }
    },
  },

  // FILESYSTEM ─────────────────────────────────────────────────────────
  {
    name: "pwd",
    summary: "Print the working directory",
    category: "FILESYSTEM",
    run: ({ cwd }) => [{ text: pathLabel(cwd), tone: "path" }],
  },
  {
    name: "ls",
    summary: "List directory contents",
    usage: "ls [path]",
    category: "FILESYSTEM",
    run: ({ cwd, args }) => {
      const target = resolvePath(cwd, args[0] ?? ".");
      const node = target && nodeAt(target);
      if (!node) return errorLines(`ls: cannot access '${args[0] ?? "."}': No such directory`);
      if (node.type === "file") return [{ text: args[0] ?? "", tone: "default" }];
      const entries = Object.entries(node.children);
      if (entries.length === 0) return [{ text: "(empty)", tone: "muted" }];
      return entries.map(([name, child]) => ({
        text: child.type === "dir" ? `${name}/` : name,
        tone: child.type === "dir" ? ("accent" as const) : ("default" as const),
      }));
    },
  },
  {
    name: "cd",
    summary: "Change directory",
    usage: "cd <path>",
    category: "FILESYSTEM",
    run: ({ cwd, args, setCwd }) => {
      const dest = args[0];
      if (!dest || dest === "~" || /^c:\\?$/i.test(dest)) {
        setCwd([]);
        return [];
      }
      const target = resolvePath(cwd, dest);
      const node = target && nodeAt(target);
      if (!node) return errorLines(`cd: no such directory: ${dest}`);
      if (node.type !== "dir") return errorLines(`cd: not a directory: ${dest}`);
      setCwd(target!);
      return [];
    },
  },
  {
    name: "cat",
    summary: "Print a file's contents",
    usage: "cat <file>",
    category: "FILESYSTEM",
    run: ({ cwd, args }) => {
      if (!args[0]) return [{ text: "Usage: cat <file>", tone: "warn" }];
      const target = resolvePath(cwd, args[0]);
      const node = target && nodeAt(target);
      if (!node) return errorLines(`cat: ${args[0]}: No such file`);
      if (node.type !== "file") return errorLines(`cat: ${args[0]}: Is a directory`);
      return node.content();
    },
  },
  {
    name: "tree",
    summary: "Print the directory tree",
    category: "FILESYSTEM",
    run: ({ cwd }) => {
      const node = nodeAt(cwd) as DirNode | null;
      if (!node || node.type !== "dir") return errorLines("tree: not a directory");
      return [{ text: cwd.length ? pathLabel(cwd) : ROOT_LABEL, tone: "path" }, ...treeLines(node)];
    },
  },
];

export const COMMANDS = new Map<string, CommandSpec>(SPECS.map((s) => [s.name, s]));
export const COMMAND_NAMES = SPECS.map((s) => s.name).sort();

/** `help` is generated from the registry so it never drifts. */
export function helpLines(): Line[] {
  const order: CommandSpec["category"][] = [
    "PROFILE",
    "PROJECTS",
    "SYSTEM",
    "AI",
    "GITHUB",
    "FILESYSTEM",
  ];
  const out: Line[] = [
    { text: "Available commands", tone: "heading" },
    blank,
  ];
  for (const cat of order) {
    out.push({ text: cat, tone: "accent" });
    SPECS.filter((s) => s.category === cat).forEach((s) => {
      out.push({ text: `  ${(s.usage ?? s.name).padEnd(28)} ${s.summary}`, tone: "default" });
    });
    out.push(blank);
  }
  out.push({ text: "Tip: use Tab to autocomplete, ↑/↓ for history.", tone: "comment" });
  return out;
}

/** Argument suggestions for Tab-completion of `project`, `cat`, `cd`. */
export function argSuggestions(command: string, cwd: string[]): string[] {
  if (command === "project") return TERMINAL_PROJECTS.map((p) => p.key);
  if (command === "cat" || command === "cd" || command === "ls") {
    const node = nodeAt(cwd);
    if (node && node.type === "dir") {
      return Object.entries(node.children)
        .filter(([, c]) => (command === "cd" ? c.type === "dir" : true))
        .map(([name, c]) => (c.type === "dir" ? `${name}/` : name));
    }
  }
  return [];
}
