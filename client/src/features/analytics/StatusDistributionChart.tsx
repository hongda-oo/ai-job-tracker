import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from '@/types/application';
import type { StatusDistributionEntry } from '@/types/analytics';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  SAVED: '#9ca3af',
  APPLIED: '#3b82f6',
  OA: '#a855f7',
  PHONE_SCREEN: '#a855f7',
  INTERVIEW: '#f59e0b',
  FINAL_ROUND: '#d97706',
  OFFER: '#22c55e',
  REJECTED: '#ef4444',
  WITHDRAWN: '#9ca3af',
};

export function StatusDistributionChart({ data }: { data: StatusDistributionEntry[] }) {
  const chartData = data
    .filter((entry) => entry.count > 0)
    .map((entry) => ({ ...entry, label: APPLICATION_STATUS_LABELS[entry.status] }));

  if (chartData.length === 0) {
    return <p className="text-sm text-gray-500">No applications yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
