import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // ✅ Ensure correct base path
  base: "/",

  // ✅ Configure server (optional for dev CORS)
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // ✅ Build Settings
  build: {
    outDir: "dist",
    sourcemap: false
  }
});
