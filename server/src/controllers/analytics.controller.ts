import type { Request, Response } from 'express';
import {
  getOverview,
  getStatusDistribution,
  getTimeline,
} from '../services/analytics/analytics.service.js';

export async function overview(req: Request, res: Response) {
  const data = await getOverview(req.userId!);
  res.json({ success: true, data });
}

export async function statusDistribution(req: Request, res: Response) {
  const statusDistribution = await getStatusDistribution(req.userId!);
  res.json({ success: true, data: { statusDistribution } });
}

function parseDays(raw: unknown): number | undefined {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.min(Math.max(Math.trunc(parsed), 1), 180);
}

export async function timeline(req: Request, res: Response) {
  const days = parseDays(req.query.days);
  const timeline = await getTimeline(req.userId!, days);
  res.json({ success: true, data: { timeline } });
}
