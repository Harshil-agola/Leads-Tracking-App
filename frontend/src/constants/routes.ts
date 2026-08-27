export const API_ROUTES = {
  LEADS: '',
  LEAD_BY_ID: (id: string | number) => `/${id}`,
  LEAD_NOTES: (id: string | number) => `/${id}/notes`,
} as const;

export const APP_ROUTES = {
  HOME: '/',
  LEADS: '/leads',
  CREATE_LEAD: '/leads/new',
  LEAD_DETAIL_PATTERN: '/leads/:id',
  LEAD_DETAIL: (id: string | number) => `/leads/${id}`,
} as const;
