import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@images': path.resolve(__dirname, 'src/assets/images')
    }
  },
  publicDir: 'public',
  server: {
    port: 5173,
    open: true
  }
});
