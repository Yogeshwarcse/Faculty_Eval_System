import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // allow overriding with an environment variable; Vite will still
    // fall back to 3000 if the value is not set. When the port is busy
    // Vite will automatically try the next one and log it, so be sure to
    // hit whatever address shows in the console (e.g. http://localhost:3001)
    port: Number(process.env.PORT) || 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
