export type ProjectStatus = 'Planning' | 'InProgress' | 'Completed' | 'OnHold' | 'Archived';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  Planning: 'Planlama',
  InProgress: 'Devam Ediyor',
  Completed: 'Tamamlandı',
  OnHold: 'Beklemede',
  Archived: 'Arşivlendi',
};

export interface Project {
  id: string;
  title: string;
  summary: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  status: ProjectStatus;
  problemStatement: string;
  approachesTried?: string | null;
  finalSolution: string;
  lessonsLearned?: string | null;
  startedAt: string;
  completedAt?: string | null;
  technologies: string[];
}

// Create ve Update aynı şekli kullanır (form da bunu paylaşıyor).
export type ProjectFormValues = Omit<Project, 'id' | 'technologies'> & {
  technologyNames: string[];
};
