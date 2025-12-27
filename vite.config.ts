import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/pdf-to-markdown/',
  root: '.',
  publicDir: 'public',
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '0.1.3')
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs': ['pdfjs-dist'],
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  server: {
    port: 8080,
    strictPort: false
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
