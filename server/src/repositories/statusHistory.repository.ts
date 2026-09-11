import { prisma } from '../config/prisma.js';

export function listStatusHistory(applicationId: string) {
  return prisma.statusHistory.findMany({
    where: { applicationId },
    orderBy: { createdAt: 'desc' },
  });
}
