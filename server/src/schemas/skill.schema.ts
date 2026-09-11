import { z } from 'zod';

export const createSkillSchema = z.object({
  skill: z
    .string()
    .trim()
    .min(1, 'Skill is required')
    .max(100)
    .transform((s) => s.replace(/\s+/g, ' ')),
  proficiency: z
    .string()
    .trim()
    .max(50)
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
