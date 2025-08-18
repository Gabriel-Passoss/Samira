import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    test: {
      globals: true,
      environment: 'node',
      setupFiles: ['tests/setup.ts'],
      testTimeout: 120000, // 2 minutes for E2E tests
      hookTimeout: 60000, // 1 minute for hooks
      teardownTimeout: 30000, // 30 seconds for teardown
      include: ['tests/e2e/*.e2e.spec.ts'],
      exclude: ['tests/services/**/*.spec.ts', 'tests/factories/**/*.test.ts'],
      env: {
        NODE_ENV: 'test',
        RIOT_API_KEY: env.RIOT_API_KEY,
      },
      coverage: {
        enabled: false, // Disable coverage for E2E tests
      },
      reporters: ['verbose'],
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true, // Use single fork for E2E tests
        },
      },
    },
  };
});
