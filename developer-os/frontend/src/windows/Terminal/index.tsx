"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Minus, Square, X, Copy, SquareTerminal } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import type { HistoryEntry, Line, Tone, CommandContext } from "./types";
import { pathLabel } from "./filesystem";
import {
  COMMANDS,
  COMMAND_NAMES,
  helpLines,
  argSuggestions,
} from "./commands";
import { TERMINAL_VERSION, WINDOWS_VERSION } from "./content";

/** Tone → text color. A restrained, GitHub-dark-inspired palette. */
const TONE: Record<Tone, string> = {
  default: "text-zinc-300",
  muted: "text-zinc-500",
  comment: "text-zinc-600",
  heading: "font-medium text-zinc-100",
  accent: "text-sky-400",
  path: "text-emerald-400",
  success: "text-emerald-400",
  warn: "text-amber-400",
  error: "text-rose-400",
  key: "text-zinc-200",
};

const STARTUP: Line[] = [
  { text: `Microsoft Windows [Version ${WINDOWS_VERSION}]`, tone: "muted" },
  { text: `DeveloperOS Terminal v${TERMINAL_VERSION}`, tone: "heading" },
  { text: "(c) DeveloperOS. All rights reserved.", tone: "muted" },
  { text: "" },
  { text: 'Type "help" to view available commands.', tone: "default" },
  { text: "" },
];

/** A braille spinner shown while an async command is in flight. */
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
function Spinner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % SPINNER.length), 80);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-2 text-zinc-500">
      <span className="text-sky-400">{SPINNER[i]}</span>
      <span>working…</span>
    </div>
  );
}

function LineView({ line, delay }: { line: Line; delay: number }) {
  const cls = TONE[line.tone ?? "default"];
  const body = line.text === "" ? " " : line.text;
  return (
    <div
      className={cn("terminal-line whitespace-pre-wrap break-words", cls)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {line.href ? (
        <a
          href={line.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}

/** A run prompt + its rendered output. */
function EntryView({ entry }: { entry: HistoryEntry }) {
  return (
    <div className="mt-1">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-emerald-400">{entry.prompt}</span>
        <span className="text-zinc-200">{entry.input}</span>
      </div>
      {entry.pending ? (
        <div className="mt-0.5">
          <Spinner />
        </div>
      ) : (
        entry.lines.map((line, i) => (
          <LineView key={i} line={line} delay={Math.min(i, 24) * 11} />
        ))
      )}
    </div>
  );
}

export default function TerminalWindow() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<string[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [focused, setFocused] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<number>(0);
  const idRef = useRef(0);

  const isMobile = useIsMobile();

  // Window controls (terminal is a singleton window with id === "terminal").
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const isMaximized = useWindowStore(
    (s) => s.windows.find((w) => w.id === "terminal")?.isMaximized ?? false,
  );

  const promptString = useMemo(() => `${pathLabel(cwd)}>`, [cwd]);

  useEffect(() => {
    mountRef.current = Date.now();
  }, []);

  // Keep the latest output in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const nextId = () => `e${idRef.current++}`;

  const submit = useCallback(() => {
    const raw = input;
    const trimmed = raw.trim();
    setInput("");
    setHistoryIndex(null);
    if (trimmed) setCmdHistory((h) => [...h, raw]);

    const prompt = promptString;

    // Empty line: just echo the prompt, like a real shell.
    if (!trimmed) {
      setEntries((e) => [...e, { id: nextId(), prompt, input: raw, lines: [] }]);
      return;
    }

    const word = trimmed.split(/\s+/)[0];
    const lower = word.toLowerCase();
    const argline = trimmed.slice(word.length).trim();
    const args = argline.length ? argline.split(/\s+/) : [];

    // `clear` wipes the scrollback.
    if (lower === "clear" || lower === "cls") {
      setEntries([]);
      return;
    }
    if (lower === "help") {
      setEntries((e) => [...e, { id: nextId(), prompt, input: raw, lines: helpLines() }]);
      return;
    }

    const spec = COMMANDS.get(lower);
    if (!spec) {
      setEntries((e) => [
        ...e,
        {
          id: nextId(),
          prompt,
          input: raw,
          lines: [
            { text: `'${word}' is not recognized as a command.`, tone: "error" },
            { text: 'Type "help" to see the available commands.', tone: "muted" },
          ],
        },
      ]);
      return;
    }

    const ctx: CommandContext = {
      args,
      argline,
      cwd,
      setCwd,
      clearScreen: () => setEntries([]),
      uptimeSeconds: () =>
        Math.max(0, Math.floor((Date.now() - mountRef.current) / 1000)),
    };

    const result = spec.run(ctx);
    const id = nextId();

    if (result instanceof Promise) {
      setEntries((e) => [...e, { id, prompt, input: raw, lines: [], pending: true }]);
      result
        .then((lines) =>
          setEntries((e) =>
            e.map((en) => (en.id === id ? { ...en, lines, pending: false } : en)),
          ),
        )
        .catch(() =>
          setEntries((e) =>
            e.map((en) =>
              en.id === id
                ? {
                    ...en,
                    pending: false,
                    lines: [{ text: "Command failed unexpectedly.", tone: "error" }],
                  }
                : en,
            ),
          ),
        );
    } else {
      setEntries((e) => [...e, { id, prompt, input: raw, lines: result }]);
    }
  }, [input, promptString, cwd]);

  /** Tab-completion against command names, then argument suggestions. */
  const complete = useCallback(() => {
    const tokens = input.split(/\s+/);
    const editingCommand = tokens.length === 1 && !/\s$/.test(input);
    const prefix = tokens[tokens.length - 1] ?? "";

    const candidates = editingCommand
      ? [...COMMAND_NAMES, "help", "clear"]
      : argSuggestions(tokens[0].toLowerCase(), cwd);

    const matches = candidates.filter((c) => c.startsWith(prefix));
    if (matches.length === 0) return;

    // Longest common prefix of all matches.
    let lcp = matches[0];
    for (const m of matches) {
      while (!m.startsWith(lcp)) lcp = lcp.slice(0, -1);
    }

    const base = input.slice(0, input.length - prefix.length);
    if (lcp.length > prefix.length) {
      setInput(base + lcp);
    } else if (matches.length > 1) {
      // No further completion possible — show the options.
      setEntries((e) => [
        ...e,
        {
          id: nextId(),
          prompt: promptString,
          input,
          lines: [{ text: matches.join("    "), tone: "muted" }],
        },
      ]);
    }
  }, [input, cwd, promptString]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const idx = historyIndex === null ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(cmdHistory[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const idx = historyIndex + 1;
      if (idx >= cmdHistory.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(idx);
        setInput(cmdHistory[idx]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  const toggleMaximize = () =>
    isMaximized ? restoreWindow("terminal") : maximizeWindow("terminal");

  return (
    <div className="flex h-full flex-col bg-[#0d1117] font-mono text-[13px] leading-relaxed text-zinc-300">
      {/* Toolbar / tab strip */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#21262d] bg-[#161b22] pl-2 pr-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex items-center gap-2 rounded-md bg-[#0d1117] px-2.5 py-1 text-xs text-zinc-300">
            <SquareTerminal size={13} className="text-sky-400" />
            Terminal.exe
          </span>
          <span className="hidden items-center gap-1.5 pl-1 text-[11px] text-zinc-500 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            session active
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="hidden truncate pr-2 text-[11px] text-zinc-500 md:inline">
            {pathLabel(cwd)}
          </span>
          <button
            type="button"
            aria-label="Minimize"
            onClick={() => minimizeWindow("terminal")}
            className="flex h-7 w-8 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10"
          >
            <Minus size={14} />
          </button>
          {!isMobile && (
            <button
              type="button"
              aria-label={isMaximized ? "Restore" : "Maximize"}
              onClick={toggleMaximize}
              className="flex h-7 w-8 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10"
            >
              {isMaximized ? <Copy size={12} /> : <Square size={11} />}
            </button>
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={() => closeWindow("terminal")}
            className="flex h-7 w-8 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-[#c42b1c] hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Scrollback + live prompt */}
      <div
        className="terminal-scroll min-h-0 flex-1 cursor-text overflow-auto px-3 py-2 selection:bg-sky-500/30"
        onClick={focusInput}
      >
        {STARTUP.map((line, i) => (
          <LineView key={`s${i}`} line={line} delay={i * 30} />
        ))}

        {entries.map((entry) => (
          <EntryView key={entry.id} entry={entry} />
        ))}

        {/* Active input line */}
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-emerald-400">{promptString}</span>
          <span className="relative inline-flex max-w-full items-center whitespace-pre-wrap break-all text-zinc-100">
            {input}
            <span
              className={cn(
                "ml-px inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-zinc-300",
                focused ? "terminal-cursor" : "opacity-40",
              )}
            />
          </span>
        </div>

        {/* Capture input (visually hidden, kept focused). */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Terminal input"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
