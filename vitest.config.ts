import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    test: {
      globals: true,
      environment: 'node',
      setupFiles: ['./tests/setup.ts'],
      env: {
        RIOT_API_KEY: env.RIOT_API_KEY || 'test-api-key',
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'dist/',
          'tests/',
          '**/*.d.ts',
          '**/*.config.*',
        ],
      },
    },
    resolve: {
      alias: {
        '@': './src',
      },
    },
  };
});
