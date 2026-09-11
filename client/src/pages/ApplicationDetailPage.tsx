import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatusBadge } from '@/features/applications/StatusBadge';
import { StatusHistoryTimeline } from '@/features/applications/StatusHistoryTimeline';
import { ApplicationFormModal } from '@/features/applications/ApplicationFormModal';
import {
  useApplication,
  useDeleteApplication,
  useStatusHistory,
  useUpdateApplicationStatus,
} from '@/features/applications/hooks';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from '@/types/application';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: application, isLoading, isError } = useApplication(id);
  const { data: statusHistory } = useStatusHistory(id);
  const updateStatusMutation = useUpdateApplicationStatus();
  const deleteMutation = useDeleteApplication();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return <div className="p-10 text-center text-sm text-gray-500">Loading…</div>;
  }

  if (isError || !application) {
    return (
      <div className="p-10 text-center text-sm text-red-600">
        Application not found.{' '}
        <Link to="/applications" className="text-indigo-600 hover:text-indigo-500">
          Back to applications
        </Link>
      </div>
    );
  }

  async function handleDelete() {
    if (!id) return;
    await deleteMutation.mutateAsync(id);
    navigate('/applications', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/applications" className="text-sm text-indigo-600 hover:text-indigo-500">
          ← Applications
        </Link>

        <div className="mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{application.title}</h1>
            <p className="mt-1 text-gray-600">{application.company.name}</p>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={application.status} />
              {application.aiAnalysis?.matchScore != null && (
                <span className="text-sm text-gray-500">
                  {application.aiAnalysis.matchScore}% match
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button variant="secondary" className="text-red-600" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-gray-900">Details</h2>
              <dl className="grid grid-cols-2 gap-4">
                <Field label="Location" value={application.location ?? '—'} />
                <Field label="Source" value={application.source ?? '—'} />
                <Field label="Salary" value={application.salary ?? '—'} />
                <Field label="Date applied" value={formatDate(application.dateApplied)} />
                <Field label="Recruiter" value={application.recruiterName ?? '—'} />
                <Field label="Recruiter email" value={application.recruiterEmail ?? '—'} />
                <Field
                  label="Job URL"
                  value={application.jobUrl ? application.jobUrl : '—'}
                />
              </dl>
            </section>

            {application.jobDescription && (
              <section className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-sm font-semibold text-gray-900">Job Description</h2>
                <p className="whitespace-pre-wrap text-sm text-gray-700">
                  {application.jobDescription}
                </p>
              </section>
            )}

            {application.notes && (
              <section className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-sm font-semibold text-gray-900">Notes</h2>
                <p className="whitespace-pre-wrap text-sm text-gray-700">{application.notes}</p>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">Change status</h2>
              <Select
                aria-label="Change status"
                value={application.status}
                disabled={updateStatusMutation.isPending}
                onChange={(e) =>
                  id &&
                  updateStatusMutation.mutate({ id, status: e.target.value as ApplicationStatus })
                }
              >
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {APPLICATION_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
            </section>

            <section className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-gray-900">Status History</h2>
              <StatusHistoryTimeline entries={statusHistory ?? []} />
            </section>
          </div>
        </div>
      </div>

      <ApplicationFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        application={application}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete application"
        description={`Are you sure you want to delete the application for ${application.title} at ${application.company.name}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
