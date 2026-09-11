import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSkillRequest, deleteSkillRequest, listSkillsRequest } from './api';

const SKILLS_KEY = ['skills'] as const;

export function useSkills() {
  return useQuery({ queryKey: SKILLS_KEY, queryFn: listSkillsRequest });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSkillRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_KEY });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSkillRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_KEY });
    },
  });
}
