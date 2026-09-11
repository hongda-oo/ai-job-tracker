import { apiClient, type ApiSuccess } from '@/api/client';
import type { UserSkill } from '@/types/skill';

export function listSkillsRequest() {
  return apiClient
    .get<ApiSuccess<{ skills: UserSkill[] }>>('/profile/skills')
    .then((res) => res.data.data.skills);
}

export function createSkillRequest(input: { skill: string; proficiency?: string }) {
  return apiClient
    .post<ApiSuccess<{ skill: UserSkill }>>('/profile/skills', input)
    .then((res) => res.data.data.skill);
}

export function deleteSkillRequest(id: string) {
  return apiClient.delete(`/profile/skills/${id}`);
}
