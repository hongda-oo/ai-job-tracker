import { AppError } from '../../utils/AppError.js';
import {
  createSkill,
  deleteSkill,
  findSkillByNameCaseInsensitive,
  findSkillById,
  listSkills,
} from '../../repositories/skill.repository.js';
import type { CreateSkillInput } from '../../schemas/skill.schema.js';

export function listSkillsForUser(userId: string) {
  return listSkills(userId);
}

export async function addSkillForUser(userId: string, input: CreateSkillInput) {
  const existing = await findSkillByNameCaseInsensitive(userId, input.skill);
  if (existing) {
    throw new AppError(409, 'SKILL_ALREADY_EXISTS', `"${input.skill}" is already in your skills.`);
  }

  return createSkill({ userId, skill: input.skill, proficiency: input.proficiency });
}

export async function deleteSkillForUser(userId: string, id: string) {
  const skill = await findSkillById(id);
  if (!skill || skill.userId !== userId) {
    throw new AppError(404, 'SKILL_NOT_FOUND', 'Skill not found.');
  }
  await deleteSkill(id);
}
