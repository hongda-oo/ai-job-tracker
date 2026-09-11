import { apiClient, type ApiSuccess } from '@/api/client';
import type { AnalyticsOverview, StatusDistributionEntry, TimelineEntry } from '@/types/analytics';

export function getOverviewRequest() {
  return apiClient
    .get<ApiSuccess<AnalyticsOverview>>('/analytics/overview')
    .then((res) => res.data.data);
}

export function getStatusDistributionRequest() {
  return apiClient
    .get<ApiSuccess<{ statusDistribution: StatusDistributionEntry[] }>>(
      '/analytics/status-distribution',
    )
    .then((res) => res.data.data.statusDistribution);
}

export function getTimelineRequest(days: number) {
  return apiClient
    .get<ApiSuccess<{ timeline: TimelineEntry[] }>>('/analytics/timeline', { params: { days } })
    .then((res) => res.data.data.timeline);
}
