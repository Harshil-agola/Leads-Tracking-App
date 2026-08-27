import cors from 'cors';
import express, {
	type Application,
	type NextFunction,
	type Request,
	type Response,
} from 'express';
import morgan from 'morgan';
import { EnvConfig } from './config/index.js';
import { leadsRoute } from './routes/index.js';

const app: Application = express();

app.use(morgan('dev'));

app.use(
	cors({
		origin: [EnvConfig.FRONTEND_ORIGIN],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/leads', leadsRoute);

app.get('/health', (_req, res) => {
	res.status(200).json({
		message: 'Server is running',
		timestamp: new Date().toISOString(),
	});
});

app.use((_req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error('Unhandled error:', err);
	res.status(500).json({
		success: false,
		message: 'Internal server error',
	});
});

export default app;
