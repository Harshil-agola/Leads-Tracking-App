import { z } from 'zod';

export const createLeadSchema = z.object({
	name: z
		.string({ error: 'Name is required' })
		.trim()
		.min(1, 'Name cannot be empty'),
	email: z.email('Invalid email address').trim(),
	phone: z.string().trim().optional().default(''),
	status: z
		.enum(['new', 'contacted', 'qualified', 'lost'], {
			error: () => ({
				message: "Status must be 'new', 'contacted', 'qualified', or 'lost'",
			}),
		})
		.default('new'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
