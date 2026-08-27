import jwt from 'jsonwebtoken';
import { EnvConfig } from '../config/index.js';
import { loginSchema } from '../validations/index.js';

export class AuthService {
	async login(
		data: unknown,
	): Promise<{ user: { email: string }; token: string }> {
		const parsed = loginSchema.parse(data);
		const inputEmail = parsed.email.trim().toLowerCase();
		const inputPassword = parsed.password.trim();

		const targetEmail = (EnvConfig.ADMIN_EMAIL || '').trim().toLowerCase();
		const targetPassword = (EnvConfig.ADMIN_PASSWORD || '').trim();

		if (!targetEmail || !targetPassword) {
			const error = new Error(
				'Admin access disabled. Server credentials not configured.',
			);
			(error as Error & { status?: number }).status = 401;
			throw error;
		}

		if (inputEmail !== targetEmail || inputPassword !== targetPassword) {
			const error = new Error('Invalid email or password');
			(error as Error & { status?: number }).status = 401;
			throw error;
		}

		const token = jwt.sign(
			{ email: targetEmail, role: 'admin' },
			EnvConfig.JWT_SECRET,
			{ algorithm: 'HS256', expiresIn: '1d' },
		);

		return {
			user: { email: targetEmail },
			token,
		};
	}
}

export const authService = new AuthService();
