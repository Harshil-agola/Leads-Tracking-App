import { z } from 'zod';

// Note: Email Regex syntext taken from the google search and docs
const emailSchema = z
	.string()
	.trim()
	.toLowerCase()
	.max(255, 'Email must be 255 characters or fewer')
	.regex(
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		'Invalid email address format (e.g. user@example.com)',
	);

export const createLeadSchema = z.object({
	name: z
		.string({ error: 'Name is required' })
		.trim()
		.min(1, 'Name cannot be empty')
		.max(100, 'Name must be 100 characters or fewer'),
	email: emailSchema,
	phone: z
		.string()
		.trim()
		.max(30, 'Phone must be 30 characters or fewer')
		.optional()
		.default(''),
	status: z
		.enum(['new', 'contacted', 'qualified', 'lost'], {
			error: () => ({
				message: "Status must be 'new', 'contacted', 'qualified', or 'lost'",
			}),
		})
		.default('new'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, 'Name cannot be empty')
			.max(100, 'Name must be 100 characters or fewer')
			.optional(),
		email: emailSchema.optional(),
		phone: z
			.string()
			.trim()
			.max(30, 'Phone must be 30 characters or fewer')
			.optional(),
		status: z
			.enum(['new', 'contacted', 'qualified', 'lost'], {
				error: () => ({
					message: "Status must be 'new', 'contacted', 'qualified', or 'lost'",
				}),
			})
			.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: 'At least one field must be provided for update',
	});

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
