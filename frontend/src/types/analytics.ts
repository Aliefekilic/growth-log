export interface TechUsage {
  technologyName: string;
  projectCount: number;
  firstUsedAt: string;
}

export interface TechTimelineItem {
  technologyName: string;
  firstUsedAt: string;
  projectId: string;
  projectTitle: string;
  projectSummary: string;
  problemStatement: string;
  finalSolution: string;
}

export interface AnalyticsOverview {
  totalProjects: number;
  totalCertificates: number;
  totalRepositories: number;
  totalBlogPosts: number;
  statusBreakdown: Record<string, number>;
  topTechnologies: TechUsage[];
  technologyTimeline: TechTimelineItem[];
}
