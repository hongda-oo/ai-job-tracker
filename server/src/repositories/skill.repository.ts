import { prisma } from '../config/prisma.js';

export function listSkills(userId: string) {
  return prisma.userSkill.findMany({ where: { userId }, orderBy: { skill: 'asc' } });
}

export function findSkillByNameCaseInsensitive(userId: string, skill: string) {
  return prisma.userSkill.findFirst({
    where: { userId, skill: { equals: skill, mode: 'insensitive' } },
  });
}

export function findSkillById(id: string) {
  return prisma.userSkill.findUnique({ where: { id } });
}

export function createSkill(data: { userId: string; skill: string; proficiency?: string }) {
  return prisma.userSkill.create({ data });
}

export function deleteSkill(id: string) {
  return prisma.userSkill.delete({ where: { id } });
}
