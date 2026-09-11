import type { ApplicationStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { applicationStatusValues } from '../schemas/application.schema.js';

export function countApplications(userId: string) {
  return prisma.jobApplication.count({ where: { userId } });
}

export function countApplicationsSince(userId: string, since: Date) {
  return prisma.jobApplication.count({ where: { userId, createdAt: { gte: since } } });
}

export function countApplicationsByStatuses(
  userId: string,
  statuses: readonly ApplicationStatus[],
) {
  return prisma.jobApplication.count({ where: { userId, status: { in: [...statuses] } } });
}

export async function groupByStatus(userId: string) {
  const groups = await prisma.jobApplication.groupBy({
    by: ['status'],
    where: { userId },
    _count: true,
  });

  const counts = new Map(groups.map((g) => [g.status, g._count]));
  return applicationStatusValues.map((status) => ({ status, count: counts.get(status) ?? 0 }));
}

export function listCreatedDatesSince(userId: string, since: Date) {
  return prisma.jobApplication.findMany({
    where: { userId, createdAt: { gte: since } },
    select: { createdAt: true },
  });
}
