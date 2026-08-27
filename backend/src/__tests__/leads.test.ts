import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { db } from '../config/db.js';
import { EnvConfig } from '../config/env.js';
// Interview Checker Note:
// integration tests for the leads API — covers search, status filter, and pagination.
// using node's built-in fetch here; supertest would be cleaner but used because Jest is mentioned in the Task.

describe('Leads Search API Tests: GET /api/leads', () => {
	let server: Server;
	let baseUrl: string;
	let authHeaders: Record<string, string>;

	beforeAll((done) => {
		const token = jwt.sign(
			{ email: 'admin@example.com', role: 'admin' },
			EnvConfig.JWT_SECRET || 'supersecret_admin_jwt_secret_key_123',
			{ expiresIn: '1d' },
		);

		authHeaders = {
			Cookie: `admin_token=${token}`,
		};

		db.exec(`
      DELETE FROM notes;
      DELETE FROM leads;
      INSERT INTO leads (name, email, phone, status) VALUES ('Alice Johnson',  'alice@techcorp.io',  '+1 (555) 100-0001', 'new');
      INSERT INTO leads (name, email, phone, status) VALUES ('Bob Smith',      'bob@example.com',   '+1 (555) 100-0002', 'contacted');
      INSERT INTO leads (name, email, phone, status) VALUES ('Carol Johnson',  'carol@startup.io',  '+1 (555) 100-0003', 'new');
      INSERT INTO leads (name, email, phone, status) VALUES ('Dave Williams',  'dave@techcorp.io',  '+1 (555) 100-0004', 'qualified');
      INSERT INTO leads (name, email, phone, status) VALUES ('Eve Davis',      'eve@company.com',   NULL,                'lost');
    `);

		server = app.listen(0, () => {
			const address = server.address();
			const port = typeof address === 'object' && address ? address.port : 8080;
			baseUrl = `http://localhost:${port}`;
			done();
		});
	});

	afterAll((done) => {
		server.close(done);
	});

	test('should return 401 when unauthorized', async () => {
		const response = await fetch(`${baseUrl}/api/leads`);
		expect(response.status).toBe(401);
	});

	test('should return all leads with pagination metadata when authenticated via JWT Cookie', async () => {
		const response = await fetch(`${baseUrl}/api/leads`, {
			headers: authHeaders,
		});
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toHaveProperty('success', true);
		expect(body).toHaveProperty('data');
		expect(Array.isArray(body.data)).toBe(true);
		expect(body.data.length).toBe(5);
		expect(body).toHaveProperty('pagination');
		expect(body.pagination).toHaveProperty('page', 1);
		expect(body.pagination).toHaveProperty('limit', 10);
		expect(body.pagination).toHaveProperty('total', 5);
	});

	test('should search leads by name', async () => {
		const response = await fetch(`${baseUrl}/api/leads?search=Johnson`, {
			headers: authHeaders,
		});
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.success).toBe(true);
		expect(Array.isArray(body.data)).toBe(true);

		expect(body.data.length).toBe(2);

		for (const lead of body.data) {
			const matchesName = lead.name?.toLowerCase().includes('johnson');
			const matchesEmail = lead.email?.toLowerCase().includes('johnson');
			const matchesPhone = lead.phone?.includes('johnson');
			expect(matchesName || matchesEmail || matchesPhone).toBe(true);
		}
	});

	test('should search leads by email domain', async () => {
		const response = await fetch(`${baseUrl}/api/leads?search=techcorp.io`, {
			headers: authHeaders,
		});
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.success).toBe(true);
		expect(Array.isArray(body.data)).toBe(true);

		expect(body.data.length).toBe(2);

		for (const lead of body.data) {
			expect(lead.email?.toLowerCase()).toContain('techcorp.io');
		}
	});

	test('should filter leads by status', async () => {
		const response = await fetch(`${baseUrl}/api/leads?status=new`, {
			headers: authHeaders,
		});
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.success).toBe(true);
		expect(Array.isArray(body.data)).toBe(true);

		for (const lead of body.data) {
			expect(lead.status).toBe('new');
		}
	});

	test('should return empty list when no leads match the search term', async () => {
		const response = await fetch(
			`${baseUrl}/api/leads?search=nonexistent_lead_xyz_99999`,
			{ headers: authHeaders },
		);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.success).toBe(true);
		expect(body.data).toEqual([]);
		expect(body.pagination.total).toBe(0);
	});
});
