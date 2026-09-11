import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createApplicationRequest,
  deleteApplicationRequest,
  getApplicationRequest,
  getStatusHistoryRequest,
  listApplicationsRequest,
  updateApplicationRequest,
  updateApplicationStatusRequest,
  type ListApplicationsParams,
} from './api';
import type { ApplicationFormValues } from '@/schemas/application';
import type { ApplicationStatus } from '@/types/application';

const applicationsKey = (params?: ListApplicationsParams) => ['applications', params] as const;

export function useApplications(params: ListApplicationsParams) {
  return useQuery({
    queryKey: applicationsKey(params),
    queryFn: () => listApplicationsRequest(params),
    placeholderData: (previous) => previous,
  });
}

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => getApplicationRequest(id!),
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ApplicationFormValues) => createApplicationRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ApplicationFormValues> }) =>
      updateApplicationRequest(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApplicationRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      updateApplicationStatusRequest(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['statusHistory', variables.id] });
    },
  });
}

export function useStatusHistory(id: string | undefined) {
  return useQuery({
    queryKey: ['statusHistory', id],
    queryFn: () => getStatusHistoryRequest(id!),
    enabled: !!id,
  });
}
