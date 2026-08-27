import { db } from '../config/db.js';
import type {
	GetLeadsParams,
	Lead,
	LeadWithNotes,
	LeadWithNotesCount,
	Note,
} from '../types/index.js';
import { createLeadSchema, updateLeadSchema } from '../validations/index.js';

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

	getLeadById(id: number): LeadWithNotes {
		const lead = db
			.prepare('SELECT * FROM leads WHERE id = ?')
			.get(id) as unknown as Lead | undefined;

		if (!lead) {
			const error = new Error('Lead not found');
			(error as Error & { status?: number }).status = 404;
			throw error;
		}

		const notes = db
			.prepare('SELECT * FROM notes WHERE leadId = ? ORDER BY id DESC')
			.all(id) as unknown as Note[];

		return {
			...lead,
			notes,
		};
	}

	createLead(data: unknown | Lead) {
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

	updateLead(id: number, data: unknown | Lead) {
		const validated = updateLeadSchema.parse(data);

		const existing = db
			.prepare('SELECT id FROM leads WHERE id = ?')
			.get(id);

		if (!existing) {
			const error = new Error('Lead not found');
			(error as Error & { status?: number }).status = 404;
			throw error;
		}

		if (validated.email) {
			const duplicate = db
				.prepare('SELECT id FROM leads WHERE email = ? AND id != ?')
				.get(validated.email, id);

			if (duplicate) {
				const error = new Error('Lead with this email already exists');
				(error as Error & { status?: number }).status = 409;
				throw error;
			}
		}

		const updates: string[] = [];
		const values: (string | number | null)[] = [];

		if (validated.name !== undefined) {
			updates.push('name = ?');
			values.push(validated.name);
		}

		if (validated.email !== undefined) {
			updates.push('email = ?');
			values.push(validated.email);
		}

		if (validated.phone !== undefined) {
			updates.push('phone = ?');
			values.push(validated.phone);
		}

		if (validated.status !== undefined) {
			updates.push('status = ?');
			values.push(validated.status);
		}

		updates.push("updatedAt = datetime('now')");
		values.push(id);

		const lead = db
			.prepare(
				`UPDATE leads
				SET ${updates.join(', ')}
				WHERE id = ?
				RETURNING *`,
			)
			.get(...values) as unknown as Lead;

		return lead;
	}

	deleteLead(id: number) {
		const existing = db
			.prepare('SELECT id FROM leads WHERE id = ?')
			.get(id);

		if (!existing) {
			const error = new Error('Lead not found');
			(error as Error & { status?: number }).status = 404;
			throw error;
		}

		db.prepare('DELETE FROM leads WHERE id = ?').run(id);

		return { id };
	}
}

export const leadsService = new LeadsService();
