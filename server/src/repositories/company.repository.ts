import { prisma } from '../config/prisma.js';

export function findOrCreateCompanyByName(name: string) {
  return prisma.company.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}
