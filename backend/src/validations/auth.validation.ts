import { z } from 'zod';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const emailSchema = z
	.email({ error: 'Email is required' })
	.trim()
	.toLowerCase()
	.max(255, 'Email must be 255 characters or fewer')
	.regex(emailRegex, 'Invalid email address format (e.g. user@example.com)');

export const loginSchema = z.object({
	email: emailSchema,
	password: z
		.string({ error: 'Password is required' })
		.min(1, 'Password cannot be empty'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const jwtPayloadSchema = z.object({
	email: emailSchema,
	role: z.string().min(1, 'Role is required'),
});

export type JwtPayloadInput = z.infer<typeof jwtPayloadSchema>;
