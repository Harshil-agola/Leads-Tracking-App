import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { EnvConfig } from '../config/index.js';
import { jwtPayloadSchema } from '../validations/index.js';

export interface AuthenticatedRequest extends Request {
	user?: {
		email: string;
		role: string;
	};
}

export const authMiddleware = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): void => {
	let token: string | undefined = req.cookies?.admin_token;

	if (!token && req.headers.cookie) {
		const cookies = req.headers.cookie
			.split(';')
			.reduce<Record<string, string>>((acc, curr) => {
				const [key, value] = curr.trim().split('=');
				if (key && value) acc[key] = decodeURIComponent(value);
				return acc;
			}, {});
		token = cookies.admin_token;
	}

	if (!token && req.headers.authorization) {
		const authHeader = req.headers.authorization.trim();
		if (authHeader.toLowerCase().startsWith('bearer ')) {
			token = authHeader.slice(7).trim();
		} else {
			token = authHeader;
		}
	}

	if (!token) {
		res.status(401).json({
			success: false,
			message: 'Unauthorized access. Please log in.',
		});
		return;
	}

	try {
		const decoded = jwt.verify(token, EnvConfig.JWT_SECRET, {
			algorithms: ['HS256'],
		});

		const parsedPayload = jwtPayloadSchema.parse(decoded);

		req.user = parsedPayload;
		next();
	} catch {
		res.status(401).json({
			success: false,
			message: 'Unauthorized access. Session expired or invalid.',
		});
	}
};

export const basicAuthMiddleware = authMiddleware;
