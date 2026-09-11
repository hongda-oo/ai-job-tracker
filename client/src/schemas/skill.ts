import { z } from 'zod';

export const skillFormSchema = z.object({
  skill: z.string().trim().min(1, 'Skill is required'),
  proficiency: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
});

export type SkillFormValues = z.infer<typeof skillFormSchema>;
