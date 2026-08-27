import { db } from '../config/db.js';
import type {
	GetLeadsParams,
	Lead,
	LeadWithNotesCount,
} from '../types/index.js';
import { createLeadSchema } from '../validations/index.js';

export class LeadsService {
	getLeads(params: GetLeadsParams = {}) {
		const search = params.search ? params.search.trim() : '';
		const status = params.status ? params.status.trim() : '';
		const page = params.page ? Number(params.page) : 1;
		const limit = params.limit ? Number(params.limit) : 10;
		const offset = (page - 1) * limit;

		let whereSql = '';
		const sqlParams: (string | number)[] = [];
		const filters: string[] = [];

		if (status) {
			filters.push('leads.status = ?');
			sqlParams.push(status);
		}

		if (search) {
			filters.push(
				'(leads.name LIKE ? OR leads.email LIKE ? OR leads.phone LIKE ?)',
			);
			const pattern = `%${search}%`;
			sqlParams.push(pattern, pattern, pattern);
		}

		if (filters.length > 0) {
			whereSql = `WHERE ${filters.join(' AND ')}`;
		}

		const totalCount = db
			.prepare(`SELECT COUNT(*) as total FROM leads ${whereSql}`)
			.get(...sqlParams) as { total: number };

		const total = totalCount?.total || 0;

		const leads = db
			.prepare(
				`SELECT
					leads.*,
					COUNT(notes.id) as notesCount
				FROM leads
				LEFT JOIN notes ON notes.leadId = leads.id
				${whereSql}
				GROUP BY leads.id
				ORDER BY leads.id DESC
				LIMIT ? OFFSET ?`,
			)
			.all(...sqlParams, limit, offset) as unknown as LeadWithNotesCount[];

		return {
			leads,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit) || 1,
			},
		};
	}

	createLead(data: unknown) {
		const validated = createLeadSchema.parse(data);

		const existing = db
			.prepare('SELECT id FROM leads WHERE email = ?')
			.get(validated.email);

		if (existing) {
			const error = new Error('Lead with this email already exists');
			(error as Error & { status?: number }).status = 409;
			throw error;
		}

		const lead = db
			.prepare(
				`INSERT INTO leads (name, email, phone, status)
				VALUES (?, ?, ?, ?)
				RETURNING *`,
			)
			.get(
				validated.name,
				validated.email,
				validated.phone || null,
				validated.status,
			) as unknown as Lead;

		return lead;
	}
}

export const leadsService = new LeadsService();
