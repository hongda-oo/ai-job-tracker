import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Select } from '@/components/Select';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type JobApplication,
} from '@/types/application';
import { StatusBadge } from '@/features/applications/StatusBadge';
import { ApplicationFormModal } from '@/features/applications/ApplicationFormModal';
import { useApplications, useDeleteApplication } from '@/features/applications/hooks';

const PAGE_SIZE = 20;

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ApplicationsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | undefined>();
  const [deletingApplication, setDeletingApplication] = useState<JobApplication | undefined>();

  const { data, isLoading, isError } = useApplications({
    search: search || undefined,
    status: (status || undefined) as never,
    page,
    limit: PAGE_SIZE,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });
  const deleteMutation = useDeleteApplication();

  function openCreateForm() {
    setEditingApplication(undefined);
    setFormOpen(true);
  }

  function openEditForm(application: JobApplication) {
    setEditingApplication(application);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deletingApplication) return;
    await deleteMutation.mutateAsync(deletingApplication.id);
    setDeletingApplication(undefined);
  }

  const applications = data?.applications ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500">
              ← Dashboard
            </Link>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">Applications</h1>
          </div>
          <Button onClick={openCreateForm}>+ Add Application</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="w-64">
            <TextField
              label="Search"
              placeholder="Company, title, notes…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="w-48">
            <Select
              label="Status"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All statuses</option>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {APPLICATION_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading applications…</div>
          ) : isError ? (
            <div className="p-8 text-center text-sm text-red-600">
              Failed to load applications. Please try again.
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No applications yet. Click &ldquo;+ Add Application&rdquo; to get started.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Company', 'Role', 'Location', 'Status', 'Applied', 'Match', 'Source', 'Updated', ''].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{app.company.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{app.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{app.location ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(app.dateApplied)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {app.aiAnalysis?.matchScore != null ? `${app.aiAnalysis.matchScore}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{app.source ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(app.updatedAt)}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        onClick={() => openEditForm(app)}
                        className="mr-3 text-indigo-600 hover:text-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingApplication(app)}
                        className="text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ApplicationFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        application={editingApplication}
      />

      <ConfirmDialog
        open={!!deletingApplication}
        title="Delete application"
        description={`Are you sure you want to delete the application for ${deletingApplication?.title} at ${deletingApplication?.company.name}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingApplication(undefined)}
      />
    </div>
  );
}
