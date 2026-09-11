import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/Button';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/features/applications/StatusBadge';
import { ApplicationFormModal } from '@/features/applications/ApplicationFormModal';
import { useApplications } from '@/features/applications/hooks';
import { useOverview, useStatusDistribution, useTimeline } from '@/features/analytics/hooks';
import { StatusDistributionChart } from '@/features/analytics/StatusDistributionChart';
import { ApplicationsTimelineChart } from '@/features/analytics/ApplicationsTimelineChart';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [addOpen, setAddOpen] = useState(false);

  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: statusDistribution } = useStatusDistribution();
  const { data: timeline } = useTimeline(30);
  const { data: recentData } = useApplications({
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    limit: 5,
    page: 1,
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Signed in as {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setAddOpen(true)}>+ Add Application</Button>
            <Button variant="secondary" onClick={() => logout()}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            label="Total Applications"
            value={overviewLoading ? '—' : (overview?.totalApplications ?? 0)}
          />
          <MetricCard
            label="Applied This Week"
            value={overviewLoading ? '—' : (overview?.applicationsThisWeek ?? 0)}
          />
          <MetricCard
            label="Interviews"
            value={overviewLoading ? '—' : (overview?.interviews ?? 0)}
            hint={overview ? `${overview.interviewRate}% of total` : undefined}
          />
          <MetricCard
            label="Offers"
            value={overviewLoading ? '—' : (overview?.offers ?? 0)}
            hint={overview ? `${overview.offerRate}% of total` : undefined}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Status Distribution</h2>
            <StatusDistributionChart data={statusDistribution ?? []} />
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Applications Over Time</h2>
            <ApplicationsTimelineChart data={timeline ?? []} />
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Applications</h2>
            <Link to="/applications" className="text-sm text-indigo-600 hover:text-indigo-500">
              View all →
            </Link>
          </div>
          {recentData && recentData.applications.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recentData.applications.map((app) => (
                <li key={app.id} className="flex items-center justify-between px-6 py-3">
                  <Link to={`/applications/${app.id}`} className="text-sm hover:text-indigo-600">
                    <span className="font-medium text-gray-900">{app.company.name}</span>
                    <span className="text-gray-500"> — {app.title}</span>
                  </Link>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-6 text-center text-sm text-gray-500">
              No applications yet. Click &ldquo;+ Add Application&rdquo; to get started.
            </p>
          )}
        </div>
      </div>

      <ApplicationFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
