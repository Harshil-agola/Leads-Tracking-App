import type { Config } from 'jest';

const config: Config = {
	clearMocks: true,
	testEnvironment: 'node',
	testMatch: ['**/src/**/__tests__/**/*.test.ts'],
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	transform: {
		'^.+\\.(t|j)sx?$': [
			'@swc/jest',
			{
				jsc: {
					parser: { syntax: 'typescript', tsx: false, decorators: true },
					target: 'es2022',
				},
			},
		],
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transformIgnorePatterns: ['/node_modules/'],
};

export default config;
