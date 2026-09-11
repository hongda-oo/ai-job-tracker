import { Router } from 'express';
import {
  createApplication,
  deleteApplicationHandler,
  getApplication,
  getStatusHistory,
  listApplications,
  updateApplication,
  updateApplicationStatus,
} from '../controllers/application.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createApplicationSchema,
  listApplicationsQuerySchema,
  updateApplicationSchema,
  updateStatusSchema,
} from '../schemas/application.schema.js';

export const applicationRouter = Router();

applicationRouter.use(requireAuth);

applicationRouter.get('/', validateQuery(listApplicationsQuerySchema), asyncHandler(listApplications));
applicationRouter.get('/:id', asyncHandler(getApplication));
applicationRouter.get('/:id/status-history', asyncHandler(getStatusHistory));
applicationRouter.post('/', validateBody(createApplicationSchema), asyncHandler(createApplication));
applicationRouter.patch(
  '/:id',
  validateBody(updateApplicationSchema),
  asyncHandler(updateApplication),
);
applicationRouter.patch(
  '/:id/status',
  validateBody(updateStatusSchema),
  asyncHandler(updateApplicationStatus),
);
applicationRouter.delete('/:id', asyncHandler(deleteApplicationHandler));
