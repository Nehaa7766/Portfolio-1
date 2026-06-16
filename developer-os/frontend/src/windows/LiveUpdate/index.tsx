"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Star,
  GitFork,
  Users,
  FolderGit2,
  ExternalLink,
  Activity as ActivityIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { GithubStats } from "@/types/github";
import { cn } from "@/lib/utils";

const POLL_MS = 60_000;

/** GitHub brand mark (lucide v1 has no brand icons). */
function GitHubMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05a9.4 9.4 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0022 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  Shell: "#89e051",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.round(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof Star;
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-start justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          <Icon size={15} />
        </span>
      </div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}

export default function LiveUpdateWindow() {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(`/api/github`, { cache: "no-store" });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `Request failed (${res.status}).`);
      }
      setStats((await res.json()) as GithubStats);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load GitHub data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Defer the initial fetch into a timer callback so setState isn't called
    // synchronously within the effect body.
    const initial = setTimeout(() => void load(), 0);
    const id = setInterval(() => void load(), POLL_MS);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [load]);

  return (
    <div className="flex h-full flex-col bg-[#060b16] font-mono text-zinc-300">
      {/* Header / profile */}
      <header className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
        <div className="flex min-w-0 items-center gap-3">
          {stats ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={stats.profile.avatarUrl}
              alt={stats.profile.login}
              className="h-12 w-12 rounded-full ring-2 ring-sky-500/40"
            />
          ) : (
            <div className="h-12 w-12 animate-pulse rounded-full bg-zinc-800" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {stats?.profile.name ?? stats?.profile.login ?? "Loading…"}
            </p>
            {stats && (
              <a
                href={stats.profile.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-sky-400 hover:underline"
              >
                <GitHubMark size={12} />@{stats.profile.login}
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                error ? "bg-red-500" : "bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400",
              )}
            />
            {error ? "Offline" : "Live"}
          </span>
          {stats && (
            <span className="hidden text-xs text-zinc-500 sm:inline">
              Updated {relativeTime(stats.lastUpdated)}
            </span>
          )}
          <button
            type="button"
            onClick={() => void load(true)}
            disabled={refreshing}
            aria-label="Refresh"
            className="rounded-md border border-white/10 p-1.5 text-zinc-300 transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {error && (
        <p className="mx-4 mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        {loading && !stats ? (
          <p className="py-10 text-center text-sm text-zinc-500">Loading GitHub activity…</p>
        ) : stats ? (
          <div className="flex flex-col gap-5">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon={FolderGit2} value={stats.profile.publicRepos} label="Public Repos" accent="#0ea5e9" />
              <StatCard icon={Star} value={stats.totalStars} label="Total Stars" accent="#f59e0b" />
              <StatCard icon={Users} value={stats.profile.followers} label="Followers" accent="#22c55e" />
              <StatCard icon={Users} value={stats.profile.following} label="Following" accent="#a855f7" />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Top repos */}
              <section>
                <SectionHeader>Top Repositories</SectionHeader>
                <div className="mt-3 flex flex-col gap-2">
                  {stats.repos.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-sky-500/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-sky-300">{repo.name}</span>
                        <span className="flex shrink-0 items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1"><Star size={12} />{repo.stars}</span>
                          <span className="flex items-center gap-1"><GitFork size={12} />{repo.forks}</span>
                        </span>
                      </div>
                      {repo.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{repo.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#94a3b8" }}
                            />
                            {repo.language}
                          </span>
                        )}
                        <span>Updated {relativeTime(repo.updatedAt)}</span>
                      </div>
                    </a>
                  ))}
                  {stats.repos.length === 0 && (
                    <p className="text-sm text-zinc-500">No public repositories yet.</p>
                  )}
                </div>
              </section>

              {/* Activity */}
              <section>
                <SectionHeader>Recent Activity</SectionHeader>
                <ol className="mt-3 flex flex-col gap-3">
                  {stats.activity.map((a) => (
                    <li key={a.id} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
                        <ActivityIcon size={12} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-zinc-300">{a.text}</p>
                        <p className="text-xs text-zinc-500">{relativeTime(a.createdAt)}</p>
                      </div>
                    </li>
                  ))}
                  {stats.activity.length === 0 && (
                    <p className="text-sm text-zinc-500">No recent public activity.</p>
                  )}
                </ol>
              </section>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
