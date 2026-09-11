import { useQuery } from '@tanstack/react-query';
import { getOverviewRequest, getStatusDistributionRequest, getTimelineRequest } from './api';

export function useOverview() {
  return useQuery({ queryKey: ['analytics', 'overview'], queryFn: getOverviewRequest });
}

export function useStatusDistribution() {
  return useQuery({
    queryKey: ['analytics', 'status-distribution'],
    queryFn: getStatusDistributionRequest,
  });
}

export function useTimeline(days = 30) {
  return useQuery({
    queryKey: ['analytics', 'timeline', days],
    queryFn: () => getTimelineRequest(days),
  });
}
