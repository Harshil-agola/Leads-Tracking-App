import type { Response } from 'express';
import { ZodError } from 'zod';
import { EnvConfig } from '../config/index.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { authService } from '../services/index.js';

export class AuthController {
	login = async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { user, token } = await authService.login(req.body);

			res.cookie('admin_token', token, {
				httpOnly: true,
				secure: EnvConfig.NODE_ENV === 'production',
				sameSite: EnvConfig.NODE_ENV === 'production' ? 'none' : 'lax',
				path: '/',
				maxAge: 24 * 60 * 60 * 1000,
			});

			return res.status(200).json({
				success: true,
				message: 'Logged in successfully',
				user,
			});
		} catch (err) {
			if (err instanceof ZodError) {
				return res.status(400).json({
					success: false,
					message: err.issues[0]?.message || 'Validation error',
				});
			}

			if ((err as Error & { status?: number })?.status === 401) {
				return res.status(401).json({
					success: false,
					message: (err as Error).message,
				});
			}

			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	};

	logout = (_req: AuthenticatedRequest, res: Response) => {
		res.clearCookie('admin_token', {
			httpOnly: true,
			secure: EnvConfig.NODE_ENV === 'production',
			sameSite: EnvConfig.NODE_ENV === 'production' ? 'none' : 'lax',
			path: '/',
		});

		return res.status(200).json({
			success: true,
			message: 'Logged out successfully',
		});
	};

	verify = (req: AuthenticatedRequest, res: Response) => {
		return res.status(200).json({
			success: true,
			message: 'Authenticated successfully',
			user: req.user,
		});
	};
}

export const authController = new AuthController();
