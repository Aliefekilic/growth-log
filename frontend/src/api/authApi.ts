import { apiClient } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const authApi = {
  login: (req: LoginRequest) => apiClient.post<AuthResponse>('/auth/login', req).then((r) => r.data),
  register: (req: RegisterRequest) => apiClient.post<AuthResponse>('/auth/register', req).then((r) => r.data),
};
