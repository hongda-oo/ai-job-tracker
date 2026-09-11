import { z } from 'zod';
import { APPLICATION_STATUSES } from '@/types/application';

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === '' ? undefined : v));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^https?:\/\/.+/i.test(v), 'Must be a valid URL (include http:// or https://)')
  .transform((v) => (v === '' ? undefined : v));

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || z.string().email().safeParse(v).success, 'Must be a valid email')
  .transform((v) => (v === '' ? undefined : v));

export const applicationFormSchema = z.object({
  company: z.string().trim().min(1, 'Company is required'),
  title: z.string().trim().min(1, 'Job title is required'),
  jobUrl: optionalUrl,
  location: optionalString,
  salary: optionalString,
  source: optionalString,
  status: z.enum(APPLICATION_STATUSES),
  dateApplied: optionalString,
  jobDescription: optionalString,
  notes: optionalString,
  recruiterName: optionalString,
  recruiterEmail: optionalEmail,
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
