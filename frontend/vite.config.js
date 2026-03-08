import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 3000,
    proxy: {
      '/api': process.env.VITE_BACKEND_URL || 'https://faculty-eval-system-1.onrender.com'
    }
  }
});
