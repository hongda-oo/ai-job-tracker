import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import type { ListApplicationsQuery } from '../schemas/application.schema.js';

const applicationInclude = {
  company: true,
  aiAnalysis: {
    select: { matchScore: true, recommendation: true },
  },
} satisfies Prisma.JobApplicationInclude;

export type ApplicationWithRelations = Prisma.JobApplicationGetPayload<{
  include: typeof applicationInclude;
}>;

function buildWhere(userId: string, query: ListApplicationsQuery): Prisma.JobApplicationWhereInput {
  const where: Prisma.JobApplicationWhereInput = { userId };

  if (query.status) where.status = query.status;
  if (query.source) where.source = { equals: query.source, mode: 'insensitive' };
  if (query.company) where.company = { name: { contains: query.company, mode: 'insensitive' } };
  if (query.title) where.title = { contains: query.title, mode: 'insensitive' };

  if (query.startDate || query.endDate) {
    where.dateApplied = {
      ...(query.startDate ? { gte: query.startDate } : {}),
      ...(query.endDate ? { lte: query.endDate } : {}),
    };
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { company: { name: { contains: query.search, mode: 'insensitive' } } },
      { notes: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

export async function listApplications(userId: string, query: ListApplicationsQuery) {
  const where = buildWhere(userId, query);
  const skip = (query.page - 1) * query.limit;

  const [applications, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      include: applicationInclude,
      orderBy: { [query.sortBy]: query.sortOrder },
      skip,
      take: query.limit,
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return { applications, total };
}

export function findApplicationById(id: string) {
  return prisma.jobApplication.findUnique({
    where: { id },
    include: applicationInclude,
  });
}

export function createApplication(
  data: Prisma.JobApplicationUncheckedCreateInput,
) {
  return prisma.jobApplication.create({
    data,
    include: applicationInclude,
  });
}

export function updateApplication(id: string, data: Prisma.JobApplicationUpdateInput) {
  return prisma.jobApplication.update({
    where: { id },
    data,
    include: applicationInclude,
  });
}

export function deleteApplication(id: string) {
  return prisma.jobApplication.delete({ where: { id } });
}
