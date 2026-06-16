/**
 * GitHub client (server-only). Fetches public profile, repositories, and
 * recent activity for a user and normalizes it for the frontend.
 *
 * Auth is optional: GITHUB_TOKEN (if set) raises the rate limit from 60/hr to
 * 5,000/hr. The token is read from the environment and NEVER sent to the
 * browser. A short in-memory cache avoids hammering the GitHub API when the
 * frontend polls for "live" updates.
 */
import "server-only";
import type {
  GithubStats,
  GithubProfile,
  GithubRepo,
  GithubActivity,
} from "@/types/github";

const API = "https://api.github.com";
const USERNAME = process.env.GITHUB_USERNAME ?? "Nehaa7766";
const CACHE_TTL_MS = 60_000;

let cache: { data: GithubStats; expires: number } | null = null;

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "DeveloperOS",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (res.status === 403 && remaining === "0") {
      throw new Error("GitHub API rate limit exceeded. Add a GITHUB_TOKEN to raise it.");
    }
    if (res.status === 404) {
      throw new Error(`GitHub user "${USERNAME}" not found.`);
    }
    throw new Error(`GitHub API error (${res.status}).`);
  }
  return res.json() as Promise<T>;
}

/* ---- raw GitHub response shapes (only the fields we use) ---- */
interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
}
interface RawRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  fork: boolean;
}
interface RawEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: { message: string }[];
    ref_type?: string;
    action?: string;
  };
}

function describeEvent(e: RawEvent): string {
  const repo = e.repo.name;
  switch (e.type) {
    case "PushEvent": {
      const n = e.payload.commits?.length ?? 0;
      return `Pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`;
    }
    case "CreateEvent":
      return `Created ${e.payload.ref_type ?? "resource"} in ${repo}`;
    case "WatchEvent":
      return `Starred ${repo}`;
    case "ForkEvent":
      return `Forked ${repo}`;
    case "IssuesEvent":
      return `${e.payload.action ?? "Updated"} an issue in ${repo}`;
    case "PullRequestEvent":
      return `${e.payload.action ?? "Updated"} a pull request in ${repo}`;
    case "ReleaseEvent":
      return `Published a release in ${repo}`;
    default:
      return `Activity in ${repo}`;
  }
}

/** Fetch and normalize all GitHub stats (cached for CACHE_TTL_MS). */
export async function getGithubStats(): Promise<GithubStats> {
  if (cache && cache.expires > Date.now()) return cache.data;

  const [user, repos, events] = await Promise.all([
    gh<RawUser>(`/users/${USERNAME}`),
    gh<RawRepo[]>(`/users/${USERNAME}/repos?per_page=100&sort=updated`),
    gh<RawEvent[]>(`/users/${USERNAME}/events/public?per_page=30`),
  ]);

  const profile: GithubProfile = {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    htmlUrl: user.html_url,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
  };

  const allRepos: GithubRepo[] = repos.map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    htmlUrl: r.html_url,
    updatedAt: r.updated_at,
  }));

  const totalStars = allRepos.reduce((sum, r) => sum + r.stars, 0);

  // Top repos by stars, then most-recently updated.
  const topRepos = [...allRepos]
    .sort((a, b) => b.stars - a.stars || +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 6);

  const activity: GithubActivity[] = events.slice(0, 12).map((e) => ({
    id: e.id,
    type: e.type,
    text: describeEvent(e),
    repo: e.repo.name,
    repoUrl: `https://github.com/${e.repo.name}`,
    createdAt: e.created_at,
  }));

  const data: GithubStats = {
    profile,
    repos: topRepos,
    activity,
    totalStars,
    lastUpdated: new Date().toISOString(),
  };

  cache = { data, expires: Date.now() + CACHE_TTL_MS };
  return data;
}
