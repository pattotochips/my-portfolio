import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * GitHub Pages has no server-side rewrite, so a deep link like
 * /my-portfolio/ooo-generator would 404 under BrowserRouter. Pages serves
 * 404.html for unknown paths, so shipping a copy of index.html under that name
 * lets the SPA boot and the router resolve the URL.
 */
const spaFallback = () => ({
  name: 'gh-pages-spa-fallback',
  closeBundle() {
    const dist = resolve(import.meta.dirname, 'dist')
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback()],
  base: '/my-portfolio/',
  build: {
    rollupOptions: {
      output: {
        // Keep the heavy, rarely-changing dependencies in their own chunks so a
        // content change does not invalidate them, and so the home page does not
        // pay for MediaPipe.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          mediapipe: ['@mediapipe/tasks-vision'],
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
})
