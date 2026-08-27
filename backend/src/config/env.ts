import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

export interface EnvTypes {
	PORT: number;
	NODE_ENV: 'development' | 'production' | string;
	FRONTEND_ORIGIN: string;
	ADMIN_EMAIL: string;
	ADMIN_PASSWORD: string;
	JWT_SECRET: string;
}

export const EnvConfig: EnvTypes = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: Number(process.env.PORT) || 8080,
	FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
	ADMIN_EMAIL: (process.env.ADMIN_EMAIL || '').trim(),
	ADMIN_PASSWORD: (process.env.ADMIN_PASSWORD || '').trim(),
	JWT_SECRET: (
		process.env.JWT_SECRET || 'supersecret_admin_jwt_secret_key_123'
	).trim(),
};
