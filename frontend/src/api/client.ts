import { API_BASE_URL, API_ROUTES } from '../constants';
import type {
  CreateLeadPayload,
  GetLeadsParams,
  GetLeadsResponse,
  LeadWithNotes,
  Note,
  SingleLeadResponse,
  UpdateLeadPayload,
} from '../types/lead';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  async getLeads(params?: GetLeadsParams): Promise<GetLeadsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const qs = searchParams.toString();
    return request<GetLeadsResponse>(qs ? `${API_ROUTES.LEADS}?${qs}` : API_ROUTES.LEADS);
  },

  async getLeadById(id: string | number): Promise<LeadWithNotes> {
    const response = await request<SingleLeadResponse>(API_ROUTES.LEAD_BY_ID(id));
    return response.data;
  },

  async createLead(payload: CreateLeadPayload): Promise<LeadWithNotes> {
    const response = await request<SingleLeadResponse>(API_ROUTES.LEADS, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  async updateLead(id: string | number, payload: UpdateLeadPayload): Promise<LeadWithNotes> {
    const response = await request<SingleLeadResponse>(API_ROUTES.LEAD_BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  async deleteLead(id: string | number): Promise<{ message: string }> {
    return request<{ success: boolean; message: string }>(API_ROUTES.LEAD_BY_ID(id), {
      method: 'DELETE',
    });
  },

  async getNotes(leadId: string | number): Promise<Note[]> {
    const response = await request<{ success: boolean; data: Note[] }>(
      API_ROUTES.LEAD_NOTES(leadId)
    );
    return response.data;
  },

  async addNote(leadId: string | number, content: string): Promise<Note> {
    const response = await request<{ success: boolean; data: Note }>(
      API_ROUTES.LEAD_NOTES(leadId),
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      }
    );
    return response.data;
  },
};

export default api;
