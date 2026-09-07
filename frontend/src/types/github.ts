export interface Repository {
  name: string;
  primaryLanguage?: string | null;
  starCount: number;
  repoUpdatedAt: string;
  htmlUrl: string;
}

export interface GithubAccount {
  githubUsername: string;
  lastSyncedAt?: string | null;
  repositories: Repository[];
}
