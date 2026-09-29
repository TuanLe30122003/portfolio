import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Set before test files import AppModule (ConfigModule reads env at import time).
    env: { REVALIDATE_SECRET: 'test-secret' },
  },
});
