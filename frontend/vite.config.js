import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // If you enable REAL_API in src/api.js, this proxy will avoid CORS issues.
      '/api': { target: 'http://localhost:5000', changeOrigin: true }
    }
  },
  resolve: { dedupe: ['react','react-dom'] }
})
