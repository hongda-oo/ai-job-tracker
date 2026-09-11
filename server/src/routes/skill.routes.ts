import { Router } from 'express';
import { createSkill, deleteSkillHandler, listSkills } from '../controllers/skill.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validateBody } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createSkillSchema } from '../schemas/skill.schema.js';

export const skillRouter = Router();

skillRouter.use(requireAuth);

skillRouter.get('/', asyncHandler(listSkills));
skillRouter.post('/', validateBody(createSkillSchema), asyncHandler(createSkill));
skillRouter.delete('/:id', asyncHandler(deleteSkillHandler));
