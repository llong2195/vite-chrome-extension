import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    root: '.',
    setupFiles: ['./tests/setup/chromeApiMocks.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@popup': path.resolve(__dirname, './src/popup'),
      '@options': path.resolve(__dirname, './src/options'),
      '@background': path.resolve(__dirname, './src/background'),
      '@content': path.resolve(__dirname, './src/content'),
    },
  },
});
