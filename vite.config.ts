import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' &&
      (visualizer({
        filename: './stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption),
  ].filter(Boolean),

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

  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: mode !== 'development',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/index.html'),
        options: path.resolve(__dirname, 'src/options/index.html'),
        background: path.resolve(__dirname, 'src/background/index.ts'),
        content: path.resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name === 'background' || name === 'content') {
            return `${name}.js`;
          }
          return `assets/${name}-[hash].js`;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.html')) {
            return '[name].html';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },

  // Copy public files to dist
  publicDir: 'public',
}));
