export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';

export interface Lead {
	id: number;
	name: string;
	email: string;
	phone?: string | null;
	status: LeadStatus;
	createdAt: string;
	updatedAt: string;
}

export interface LeadWithNotesCount extends Lead {
	notesCount: number;
}

export interface LeadWithNotes extends Lead {
	notes: Note[];
}

export interface GetLeadsParams {
	search?: string;
	status?: string;
	page?: number;
	limit?: number;
}

export interface Note {
	id: number;
	leadId: number;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
