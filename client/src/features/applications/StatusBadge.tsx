import clsx from 'clsx';
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from '@/types/application';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  SAVED: 'bg-gray-100 text-gray-700',
  APPLIED: 'bg-blue-100 text-blue-700',
  OA: 'bg-purple-100 text-purple-700',
  PHONE_SCREEN: 'bg-purple-100 text-purple-700',
  INTERVIEW: 'bg-amber-100 text-amber-700',
  FINAL_ROUND: 'bg-amber-100 text-amber-800',
  OFFER: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-100 text-gray-500',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
