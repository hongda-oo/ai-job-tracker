import { apiClient, type ApiSuccess } from '@/api/client';
import type { AuthResponse, User } from '@/types/auth';

export function registerRequest(input: { name: string; email: string; password: string }) {
  return apiClient
    .post<ApiSuccess<AuthResponse>>('/auth/register', input)
    .then((res) => res.data.data);
}

export function loginRequest(input: { email: string; password: string }) {
  return apiClient
    .post<ApiSuccess<AuthResponse>>('/auth/login', input)
    .then((res) => res.data.data);
}

export function logoutRequest() {
  return apiClient.post('/auth/logout');
}

export function meRequest() {
  return apiClient.get<ApiSuccess<{ user: User }>>('/auth/me').then((res) => res.data.data.user);
}
