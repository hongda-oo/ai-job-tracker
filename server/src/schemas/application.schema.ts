import { z } from 'zod';

export const applicationStatusValues = [
  'SAVED',
  'APPLIED',
  'OA',
  'PHONE_SCREEN',
  'INTERVIEW',
  'FINAL_ROUND',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
] as const;

export const applicationStatusSchema = z.enum(applicationStatusValues);

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === '' ? undefined : v));

const optionalUrl = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal('').transform(() => undefined));

const optionalEmail = z
  .string()
  .trim()
  .email('Must be a valid email')
  .optional()
  .or(z.literal('').transform(() => undefined));

export const createApplicationSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(200),
  title: z.string().trim().min(1, 'Job title is required').max(200),
  jobUrl: optionalUrl,
  location: optionalTrimmedString(200),
  salary: optionalTrimmedString(100),
  source: optionalTrimmedString(100),
  status: applicationStatusSchema.default('SAVED'),
  dateApplied: z.coerce.date().optional(),
  jobDescription: optionalTrimmedString(20000),
  notes: optionalTrimmedString(5000),
  recruiterName: optionalTrimmedString(200),
  recruiterEmail: optionalEmail,
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const updateApplicationSchema = createApplicationSchema.partial();

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

export const updateStatusSchema = z.object({
  status: applicationStatusSchema,
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

export const listApplicationsQuerySchema = z.object({
  status: applicationStatusSchema.optional(),
  company: z.string().trim().optional(),
  title: z.string().trim().optional(),
  source: z.string().trim().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'dateApplied', 'title', 'status'])
    .default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
