import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';

// ============================================
// GRUPO SAN LUIS - Vite Configuration
// Optimized for Vercel production deployment
// ============================================

// Get all HTML files for multi-page app support
const htmlFiles = glob.sync('*.html').reduce((acc, file) => {
  const name = file.replace('.html', '');
  acc[name] = resolve(__dirname, file);
  return acc;
}, {});

export default defineConfig({
  // Base path for production (Vercel serves from root)
  base: '/',

  // Build options
  build: {
    // Output directory (relative to project root)
    outDir: 'dist',

    // Generate sourcemaps only in dev mode
    sourcemap: false,

    // Minification with esbuild (faster than terser, built-in)
    minify: 'esbuild',

    // CSS code splitting
    cssCodeSplit: false,

    // Rollup options for multi-page app and optimized bundles
    rollupOptions: {
      // Multi-page app: include all HTML files as entry points
      input: htmlFiles,
      output: {
        // Manual chunks for better caching
        manualChunks: {
          vendor: []
        },
        // Asset file naming with content hash for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },

    // Ensure build doesn't fail on warnings
    reportCompressedSize: false
  },

  // Development server options
  server: {
    port: 3000,
    open: false,
    // Rewrite routes for SPA-like navigation
    proxy: {
      // Proxy API requests to local dev server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },

  // CSS preprocessing options
  css: {
    devSourcemap: false
  },

  // Dependency optimization
  optimizeDeps: {
    include: []
  }
});



