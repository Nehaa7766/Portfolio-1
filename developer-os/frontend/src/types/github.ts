/** Client-side mirror of the backend /api/github response. */

export interface GithubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  htmlUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  htmlUrl: string;
  updatedAt: string;
}

export interface GithubActivity {
  id: string;
  type: string;
  text: string;
  repo: string;
  repoUrl: string;
  createdAt: string;
}

export interface GithubStats {
  profile: GithubProfile;
  repos: GithubRepo[];
  activity: GithubActivity[];
  totalStars: number;
  lastUpdated: string;
}
