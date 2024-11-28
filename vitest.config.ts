import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['packages/**/*.{test,spec}.{js,ts}'], // Include tests from all packages
  },
});
