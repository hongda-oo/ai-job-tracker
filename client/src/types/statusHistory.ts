import type { ApplicationStatus } from './application';

export interface StatusHistoryEntry {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  createdAt: string;
}
