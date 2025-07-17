import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import the path module

const __dirname = import.meta.dirname
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // --- New build configuration ---
  build: {
    outDir: '../dist/frontend', // Output to the root `dist` folder
    emptyOutDir: true, // Clean the output directory before building
  },
  server: {
    host: true,
    allowedHosts: ['0e2e-45-115-1-166.ngrok-free.app'], // 👈 specific ngrok host
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})

