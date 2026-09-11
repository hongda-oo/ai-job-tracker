import { apiClient, type ApiSuccess } from '@/api/client';
import type { ApplicationStatus, JobApplication, Pagination } from '@/types/application';
import type { StatusHistoryEntry } from '@/types/statusHistory';
import type { ApplicationFormValues } from '@/schemas/application';

export interface ListApplicationsParams {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'dateApplied' | 'title' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export function listApplicationsRequest(params: ListApplicationsParams) {
  return apiClient
    .get<ApiSuccess<{ applications: JobApplication[]; pagination: Pagination }>>('/applications', {
      params,
    })
    .then((res) => res.data.data);
}

export function getApplicationRequest(id: string) {
  return apiClient
    .get<ApiSuccess<{ application: JobApplication }>>(`/applications/${id}`)
    .then((res) => res.data.data.application);
}

export function createApplicationRequest(input: ApplicationFormValues) {
  return apiClient
    .post<ApiSuccess<{ application: JobApplication }>>('/applications', input)
    .then((res) => res.data.data.application);
}

export function updateApplicationRequest(id: string, input: Partial<ApplicationFormValues>) {
  return apiClient
    .patch<ApiSuccess<{ application: JobApplication }>>(`/applications/${id}`, input)
    .then((res) => res.data.data.application);
}

export function deleteApplicationRequest(id: string) {
  return apiClient.delete(`/applications/${id}`);
}

export function updateApplicationStatusRequest(id: string, status: ApplicationStatus) {
  return apiClient
    .patch<ApiSuccess<{ application: JobApplication }>>(`/applications/${id}/status`, { status })
    .then((res) => res.data.data.application);
}

export function getStatusHistoryRequest(id: string) {
  return apiClient
    .get<ApiSuccess<{ statusHistory: StatusHistoryEntry[] }>>(`/applications/${id}/status-history`)
    .then((res) => res.data.data.statusHistory);
}
