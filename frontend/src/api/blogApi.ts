import { apiClient } from './client';
import type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '../types/blog';

export const blogApi = {
  getMyPosts: async (): Promise<BlogPost[]> => {
    const res = await apiClient.get<BlogPost[]>('/blog/me');
    return res.data;
  },

  getById: async (id: string): Promise<BlogPost> => {
    const res = await apiClient.get<BlogPost>(`/blog/${id}`);
    return res.data;
  },

  create: async (data: CreateBlogPostInput): Promise<BlogPost> => {
    const res = await apiClient.post<BlogPost>('/blog', data);
    return res.data;
  },

  update: async (id: string, data: UpdateBlogPostInput): Promise<BlogPost> => {
    const res = await apiClient.put<BlogPost>(`/blog/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/blog/${id}`);
  },

  getPublicPosts: async (slug: string): Promise<BlogPost[]> => {
    const res = await apiClient.get<BlogPost[]>(`/profiles/${slug}/blog`);
    return res.data;
  },

  getPublicPostBySlug: async (slug: string, postSlug: string): Promise<BlogPost> => {
    const res = await apiClient.get<BlogPost>(`/profiles/${slug}/blog/${postSlug}`);
    return res.data;
  },
};
