import type { Request, Response } from 'express';
import { addSkillForUser, deleteSkillForUser, listSkillsForUser } from '../services/skills/skill.service.js';

export async function listSkills(req: Request, res: Response) {
  const skills = await listSkillsForUser(req.userId!);
  res.json({ success: true, data: { skills } });
}

export async function createSkill(req: Request, res: Response) {
  const skill = await addSkillForUser(req.userId!, req.body);
  res.status(201).json({ success: true, data: { skill } });
}

export async function deleteSkillHandler(req: Request, res: Response) {
  await deleteSkillForUser(req.userId!, req.params.id!);
  res.json({ success: true, data: {} });
}
