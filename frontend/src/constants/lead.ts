import type { SelectOption } from '../components/common/Select';
import type { LeadStatus } from '../types/lead';

export const API_BASE_URL: string = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/leads`
  : '/api/leads';

export const LEAD_STATUSES: readonly LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'lost',
] as const;

export const LEAD_STATUS_OPTIONS: SelectOption[] = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Lost', value: 'lost' },
];

export const PAGINATION_LIMIT = 10;
export const MAX_NAME_LENGTH = 100;
export const MAX_NOTE_LENGTH = 1000;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^\+?[0-9\s().-]{7,30}$/;
