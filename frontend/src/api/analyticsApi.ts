import { apiClient } from './client';
import type { AnalyticsOverview } from '../types/analytics';

export const analyticsApi = {
  getMyAnalytics: async (): Promise<AnalyticsOverview> => {
    const res = await apiClient.get<AnalyticsOverview>('/analytics/me');
    return res.data;
  },

  getPublicAnalytics: async (slug: string): Promise<AnalyticsOverview> => {
    const res = await apiClient.get<AnalyticsOverview>(`/profiles/${slug}/analytics`);
    return res.data;
  },
};
