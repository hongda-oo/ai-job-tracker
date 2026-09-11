import type { Request, Response } from 'express';
import {
  createApplicationForUser,
  deleteApplicationForUser,
  getOwnedApplicationOrThrow,
  listApplicationsForUser,
  updateApplicationForUser,
} from '../services/applications/application.service.js';
import type { ListApplicationsQuery } from '../schemas/application.schema.js';

export async function listApplications(req: Request, res: Response) {
  const query = req.query as unknown as ListApplicationsQuery;
  const { applications, total } = await listApplicationsForUser(req.userId!, query);
  const { page, limit } = query;

  res.json({
    success: true,
    data: {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    },
  });
}

export async function getApplication(req: Request, res: Response) {
  const application = await getOwnedApplicationOrThrow(req.userId!, req.params.id!);
  res.json({ success: true, data: { application } });
}

export async function createApplication(req: Request, res: Response) {
  const application = await createApplicationForUser(req.userId!, req.body);
  res.status(201).json({ success: true, data: { application } });
}

export async function updateApplication(req: Request, res: Response) {
  const application = await updateApplicationForUser(req.userId!, req.params.id!, req.body);
  res.json({ success: true, data: { application } });
}

export async function deleteApplicationHandler(req: Request, res: Response) {
  await deleteApplicationForUser(req.userId!, req.params.id!);
  res.json({ success: true, data: {} });
}
