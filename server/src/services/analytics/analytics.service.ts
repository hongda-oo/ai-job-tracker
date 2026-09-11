import {
  countApplications,
  countApplicationsByStatuses,
  countApplicationsSince,
  groupByStatus,
  listCreatedDatesSince,
} from '../../repositories/analytics.repository.js';

const INTERVIEW_STAGE_STATUSES = ['INTERVIEW', 'FINAL_ROUND'] as const;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_TIMELINE_DAYS = 30;

function toRate(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 1000) / 10;
}

export async function getOverview(userId: string) {
  const since = new Date(Date.now() - WEEK_MS);

  const [totalApplications, applicationsThisWeek, interviews, offers, rejections] =
    await Promise.all([
      countApplications(userId),
      countApplicationsSince(userId, since),
      countApplicationsByStatuses(userId, INTERVIEW_STAGE_STATUSES),
      countApplicationsByStatuses(userId, ['OFFER']),
      countApplicationsByStatuses(userId, ['REJECTED']),
    ]);

  return {
    totalApplications,
    applicationsThisWeek,
    interviews,
    offers,
    rejections,
    interviewRate: toRate(interviews, totalApplications),
    offerRate: toRate(offers, totalApplications),
  };
}

export function getStatusDistribution(userId: string) {
  return groupByStatus(userId);
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getTimeline(userId: string, days: number = DEFAULT_TIMELINE_DAYS) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  since.setUTCHours(0, 0, 0, 0);

  const applications = await listCreatedDatesSince(userId, since);

  const counts = new Map<string, number>();
  for (const { createdAt } of applications) {
    const key = toDateKey(createdAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const timeline: { date: string; count: number }[] = [];
  for (let i = 0; i <= days; i++) {
    const day = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    const key = toDateKey(day);
    timeline.push({ date: key, count: counts.get(key) ?? 0 });
  }

  return timeline;
}
