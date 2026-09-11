import { APPLICATION_STATUS_LABELS } from '@/types/application';
import type { StatusHistoryEntry } from '@/types/statusHistory';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function StatusHistoryTimeline({ entries }: { entries: StatusHistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">No status history yet.</p>;
  }

  return (
    <ol className="relative border-l border-gray-200 pl-4">
      {entries.map((entry, index) => (
        <li key={entry.id} className="mb-6 last:mb-0">
          <span
            className={
              'absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full ' +
              (index === 0 ? 'bg-indigo-600' : 'bg-gray-300')
            }
          />
          <p className="text-sm font-medium text-gray-900">
            {APPLICATION_STATUS_LABELS[entry.status]}
          </p>
          <time className="text-xs text-gray-500">{formatDateTime(entry.createdAt)}</time>
        </li>
      ))}
    </ol>
  );
}
