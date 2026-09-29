import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || (process.env.VERCEL || process.env.NETLIFY ? '/' : '/car-modification-3d-site/'),
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
  server: { port: 3001 },
  build: {
    chunkSizeWarningLimit: 1500,
  },
});