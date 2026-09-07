import { apiClient } from './client';
import type { Certificate, CreateCertificateInput, UpdateCertificateInput } from '../types/certificate';

export const certificateApi = {
  getMyCertificates: async (): Promise<Certificate[]> => {
    const res = await apiClient.get<Certificate[]>('/certificates/me');
    return res.data;
  },

  getById: async (id: string): Promise<Certificate> => {
    const res = await apiClient.get<Certificate>(`/certificates/${id}`);
    return res.data;
  },

  create: async (data: CreateCertificateInput): Promise<Certificate> => {
    const res = await apiClient.post<Certificate>('/certificates', data);
    return res.data;
  },

  update: async (id: string, data: UpdateCertificateInput): Promise<Certificate> => {
    const res = await apiClient.put<Certificate>(`/certificates/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/certificates/${id}`);
  },

  getPublicCertificates: async (slug: string): Promise<Certificate[]> => {
    const res = await apiClient.get<Certificate[]>(`/profiles/${slug}/certificates`);
    return res.data;
  },
};
