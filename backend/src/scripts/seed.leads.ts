import { db } from '../config/db.js';
import type { LeadStatus } from '../types/index.js';

interface SeedLead {
	name: string;
	email: string;
	phone: string;
	status: LeadStatus;
	notes: string[];
}

const sampleLeads: SeedLead[] = [
	{
		name: 'Johnson',
		email: 'alice.johnson@techcorp.io',
		phone: '+1 (555) 234-5678',
		status: 'new',
		notes: ['Inquired via website contact form about enterprise pricing.'],
	},
	{
		name: 'Bob Martinez',
		email: 'bob.m@apexsolutions.com',
		phone: '+1 (555) 345-6789',
		status: 'contacted',
		notes: [
			'Had introductory discovery call. Interested in custom integrations.',
			'Sent follow-up product brochure and case studies.',
		],
	},
	{
		name: 'Catherine Davis',
		email: 'cdavis@vanguardgrowth.co',
		phone: '+1 (555) 456-7890',
		status: 'qualified',
		notes: [
			'Budget approved for Q3 rollout (approx $25k ARR).',
			'Scheduled technical demo with lead architect for next Tuesday.',
		],
	},
];

function seed() {
	try {
		console.log('Starting seeding...');

		db.exec('BEGIN TRANSACTION;');

		db.exec('DELETE FROM notes;');
		db.exec('DELETE FROM leads;');

		const insertLead = db.prepare(`
			INSERT INTO leads (name, email, phone, status)
			VALUES (?, ?, ?, ?)
		`);

		const insertNote = db.prepare(`
			INSERT INTO notes (leadId, content)
			VALUES (?, ?)
		`);

		let totalLeads = 0;
		let totalNotes = 0;

		for (const lead of sampleLeads) {
			const result = insertLead.run(
				lead.name,
				lead.email,
				lead.phone,
				lead.status,
			);
			const leadId = result.lastInsertRowid;
			totalLeads++;

			for (const note of lead.notes) {
				insertNote.run(leadId, note);
				totalNotes++;
			}
		}

		db.exec('COMMIT;');

		console.log(
			`Seeding complete: ${totalLeads} leads and ${totalNotes} notes added.`,
		);
	} catch (_err) {
		db.exec('ROLLBACK;');
		console.error('Seeding failed:');
		process.exit(1);
	}
}

seed();
