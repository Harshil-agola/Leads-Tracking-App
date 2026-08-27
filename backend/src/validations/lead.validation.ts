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

// Note: Phone Regex syntext taken from the google search and docs
const phoneRegex = /^\+?[0-9\s().-]{7,30}$/;

const phoneSchema = z
	.string()
	.trim()
	.max(30, 'Phone must be 30 characters or fewer')
	.refine(
		(val) => {
			if (!val) return true;
			const digits = val.replace(/\D/g, '');
			return phoneRegex.test(val) && digits.length >= 7 && digits.length <= 15;
		},
		{
			message: 'Invalid phone number format (e.g. +1 (555) 234-5678)',
		},
	);

export const createLeadSchema = z.object({
	name: z
		.string({ error: 'Name is required' })
		.trim()
		.min(1, 'Name cannot be empty')
		.max(100, 'Name must be 100 characters or fewer'),
	email: emailSchema,
	phone: phoneSchema.nullable().optional().default(null),
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
		phone: phoneSchema.optional(),
		status: z
			.enum(['new', 'contacted', 'qualified', 'lost'], {
				error: () => ({
					message: "Status must be 'new', 'contacted', 'qualified', or 'lost'",
				}),
			})
			.optional(),
	})
	.refine((data) => Object.values(data).some((v) => v !== undefined), {
		message: 'At least one field must be provided for update',
	});

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

export const createNoteSchema = z.object({
	content: z
		.string({ error: 'Content is required' })
		.trim()
		.min(1, 'Content cannot be empty')
		.max(1000, 'Note cannot exceed 1000 characters'),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
	content: z
		.string({ error: 'Content is required' })
		.trim()
		.min(1, 'Content cannot be empty')
		.max(1000, 'Note cannot exceed 1000 characters'),
});

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
