import { apiClient } from './client';
import type { Profile, UpdateProfileRequest } from '../types/profile';

export const profileApi = {
  getMine: () => apiClient.get<Profile>('/profiles/me').then((r) => r.data),
  updateMine: (req: UpdateProfileRequest) =>
    apiClient.put<Profile>('/profiles/me', req).then((r) => r.data),
  getPublic: (slug: string) =>
    apiClient.get<Profile>(`/profiles/${slug}`).then((r) => r.data),
  getAllPublic: () =>
    apiClient.get<Profile[]>('/profiles/public').then((r) => r.data),
};
