import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 2026 optimization: Brotli compression for smaller transfers
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024, // Only compress files > 1KB
    }),
  ],
  base: "./",
  server: {
    // Proxy /api requests to Vercel Functions in development
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path,
      }
    }
  },
  build: {
    // 2026 optimizations: modern targets + chunk splitting + terser minification
    target: "es2022", // Modern browser targets for smaller output
    cssMinify: "lightningcss", // Faster CSS minification (2026 standard)
    modulePreload: { polyfill: false }, // Modern browsers don't need polyfill
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ["react", "react-dom", "react-router-dom"],
          animations: ["framer-motion"],
          icons: ["lucide-react", "react-icons"],
          markdown: ["react-markdown"], // Separate chunk for chatbot markdown
        },
      },
    },
    minify: "terser", // Better compression than esbuild
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        passes: 2, // Multiple compression passes for better minification
      },
    },
    sourcemap: false, // Disable for production
  },
});
