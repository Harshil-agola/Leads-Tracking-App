import app from './app.js';
import { EnvConfig } from './config/env.js';
import { shutdown } from './utils/sutdown.js';

const server = app.listen(EnvConfig.PORT, () => {
	console.log(`Server listening on port ${EnvConfig.PORT}`);
});

process.on('SIGINT', () => shutdown('SIGINT', server));
process.on('SIGTERM', () => shutdown('SIGTERM', server));

process.on('unhandledRejection', (err) => {
	console.error('Unhandled Rejection:', err);
	shutdown('unhandledRejection', server);
});

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});
