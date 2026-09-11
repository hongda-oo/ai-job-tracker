import type { ApplicationStatus } from './application';

export interface AnalyticsOverview {
  totalApplications: number;
  applicationsThisWeek: number;
  interviews: number;
  offers: number;
  rejections: number;
  interviewRate: number;
  offerRate: number;
}

export interface StatusDistributionEntry {
  status: ApplicationStatus;
  count: number;
}

export interface TimelineEntry {
  date: string;
  count: number;
}
