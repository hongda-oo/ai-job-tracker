import { AppError } from '../../utils/AppError.js';
import { findOrCreateCompanyByName } from '../../repositories/company.repository.js';
import {
  createApplication,
  deleteApplication,
  findApplicationById,
  listApplications,
  updateApplication,
} from '../../repositories/application.repository.js';
import type {
  CreateApplicationInput,
  ListApplicationsQuery,
  UpdateApplicationInput,
} from '../../schemas/application.schema.js';

export function listApplicationsForUser(userId: string, query: ListApplicationsQuery) {
  return listApplications(userId, query);
}

export async function getOwnedApplicationOrThrow(userId: string, id: string) {
  const application = await findApplicationById(id);
  if (!application || application.userId !== userId) {
    throw new AppError(404, 'APPLICATION_NOT_FOUND', 'Application not found.');
  }
  return application;
}

export async function createApplicationForUser(userId: string, input: CreateApplicationInput) {
  const { company: companyName, ...rest } = input;
  const company = await findOrCreateCompanyByName(companyName);

  return createApplication({
    ...rest,
    userId,
    companyId: company.id,
    statusHistory: {
      create: { status: rest.status },
    },
  });
}

export async function updateApplicationForUser(
  userId: string,
  id: string,
  input: UpdateApplicationInput,
) {
  const existing = await getOwnedApplicationOrThrow(userId, id);
  const { company: companyName, status, ...rest } = input;

  const companyId = companyName
    ? (await findOrCreateCompanyByName(companyName)).id
    : undefined;

  const statusChanged = status !== undefined && status !== existing.status;

  return updateApplication(id, {
    ...rest,
    ...(status !== undefined ? { status } : {}),
    ...(companyId ? { company: { connect: { id: companyId } } } : {}),
    ...(statusChanged
      ? { statusHistory: { create: { status } } }
      : {}),
  });
}

export async function deleteApplicationForUser(userId: string, id: string) {
  await getOwnedApplicationOrThrow(userId, id);
  await deleteApplication(id);
}
