export const APPLICATION_STATUSES = [
  'SAVED',
  'APPLIED',
  'OA',
  'PHONE_SCREEN',
  'INTERVIEW',
  'FINAL_ROUND',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  OA: 'OA',
  PHONE_SCREEN: 'Phone Screen',
  INTERVIEW: 'Interview',
  FINAL_ROUND: 'Final Round',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

export interface Company {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyId: string;
  title: string;
  jobUrl: string | null;
  location: string | null;
  salary: string | null;
  source: string | null;
  status: ApplicationStatus;
  dateApplied: string | null;
  jobDescription: string | null;
  notes: string | null;
  recruiterName: string | null;
  recruiterEmail: string | null;
  createdAt: string;
  updatedAt: string;
  company: Company;
  aiAnalysis: { matchScore: number | null; recommendation: string | null } | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
