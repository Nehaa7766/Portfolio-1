/** Semantic tone for a printed terminal line → maps to a color class. */
export type Tone =
  | "default"
  | "muted"
  | "comment"
  | "heading"
  | "accent"
  | "path"
  | "success"
  | "warn"
  | "error"
  | "key";

/** A single printed line of terminal output. */
export interface Line {
  text: string;
  tone?: Tone;
  /** When set, the line renders as a link (opens in a new tab). */
  href?: string;
  /** Leading indent, in spaces. Used by `tree` / `ls`. */
  indent?: number;
}

/** One entry in the scrollback: the command that was run + its output. */
export interface HistoryEntry {
  id: string;
  /** The prompt shown for this command, e.g. `C:\DeveloperOS>`. */
  prompt: string;
  /** Raw command text the user submitted. */
  input: string;
  /** Output lines (filled in once the command resolves). */
  lines: Line[];
  /** True while an async command (AI / GitHub) is still running. */
  pending?: boolean;
}

/** Helpers a command can use to affect terminal state. */
export interface CommandContext {
  args: string[];
  /** The full argument string after the command word (preserves spacing). */
  argline: string;
  cwd: string[];
  setCwd: (segments: string[]) => void;
  clearScreen: () => void;
  /** Seconds since the terminal session started. */
  uptimeSeconds: () => number;
}

export type CommandHandler = (ctx: CommandContext) => Line[] | Promise<Line[]>;

export interface CommandSpec {
  name: string;
  /** Short, one-line description shown by `help`. */
  summary: string;
  /** Category bucket used to group the `help` listing. */
  category: "PROFILE" | "PROJECTS" | "SYSTEM" | "AI" | "GITHUB" | "FILESYSTEM";
  /** Usage hint, e.g. `project <name>`. Defaults to the command name. */
  usage?: string;
  run: CommandHandler;
}
