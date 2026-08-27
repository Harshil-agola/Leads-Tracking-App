import { db } from '../config/db.js';
import type { GetLeadsParams, LeadWithNotesCount } from '../types/index.js';

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
}

export const leadsService = new LeadsService();
