import { apiClient } from './client';
import type { GithubAccount, Repository } from '../types/github';

export const githubApi = {
  getMine: () => apiClient.get<GithubAccount>('/github/me').then((r) => r.data),
  connect: (githubUsername: string) =>
    apiClient.post<GithubAccount>('/github/connect', { githubUsername }).then((r) => r.data),
  sync: () => apiClient.post<GithubAccount>('/github/sync').then((r) => r.data),
  disconnect: () => apiClient.delete('/github/disconnect'),
  getPublicForSlug: (slug: string) =>
    apiClient.get<Repository[]>(`/profiles/${slug}/repositories`).then((r) => r.data),
};
