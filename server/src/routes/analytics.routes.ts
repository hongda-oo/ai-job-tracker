import { Router } from 'express';
import { overview, statusDistribution, timeline } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get('/overview', asyncHandler(overview));
analyticsRouter.get('/status-distribution', asyncHandler(statusDistribution));
analyticsRouter.get('/timeline', asyncHandler(timeline));
