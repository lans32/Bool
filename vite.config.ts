import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  //base: "/Bool",
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://192.168.13.145:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
});