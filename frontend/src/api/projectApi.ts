import { apiClient } from './client';
import type { Project, ProjectFormValues } from '../types/project';

interface ProjectRequestBody {
  title: string;
  summary: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  status: string;
  problemStatement: string;
  approachesTried?: string | null;
  finalSolution: string;
  lessonsLearned?: string | null;
  startedAt: string;
  completedAt?: string | null;
  technologyNames: string[];
}

function toRequestBody(values: ProjectFormValues): ProjectRequestBody {
  return {
    title: values.title,
    summary: values.summary,
    repoUrl: values.repoUrl || null,
    liveUrl: values.liveUrl || null,
    status: values.status,
    problemStatement: values.problemStatement,
    approachesTried: values.approachesTried || null,
    finalSolution: values.finalSolution,
    lessonsLearned: values.lessonsLearned || null,
    startedAt: values.startedAt,
    completedAt: values.completedAt || null,
    technologyNames: values.technologyNames,
  };
}

export const projectApi = {
  getMine: () => apiClient.get<Project[]>('/projects').then((r) => r.data),
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`).then((r) => r.data),
  create: (values: ProjectFormValues) =>
    apiClient.post<Project>('/projects', toRequestBody(values)).then((r) => r.data),
  update: (id: string, values: ProjectFormValues) =>
    apiClient.put<Project>(`/projects/${id}`, toRequestBody(values)).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/projects/${id}`),
  getPublicForSlug: (slug: string) =>
    apiClient.get<Project[]>(`/profiles/${slug}/projects`).then((r) => r.data),
};

export const technologyApi = {
  getAll: () => apiClient.get<string[]>('/technologies').then((r) => r.data),
};
