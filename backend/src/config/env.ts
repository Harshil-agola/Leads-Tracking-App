import { config as dotEnvConfig } from 'dotenv';

export interface EnvTypes {
	PORT: number;
	NODE_ENV: 'development' | 'production' | string;
	FRONTEND_ORIGIN: string;
}

dotEnvConfig();

export const EnvConfig: EnvTypes = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: Number(process.env.PORT) || 8080,
	FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
};
