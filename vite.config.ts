import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths() // 👈 resolves aliases from tsconfig.json
  ],
  // base: "/admin/",
  server: {
    host: true,
    port: 5173,
  },
  build: {
    sourcemap: false, // Disable sourcemaps in production to avoid errors
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }
          
          // TanStack Query
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'react-query';
          }
          
          // Chart libraries
          if (id.includes('node_modules/recharts') || 
              id.includes('node_modules/react-apexcharts') || 
              id.includes('node_modules/apexcharts') ||
              id.includes('node_modules/react-google-charts')) {
            return 'charts';
          }
          
          // UI libraries
          if (id.includes('node_modules/lucide-react') || 
              id.includes('node_modules/react-icons') ||
              id.includes('node_modules/@heroicons')) {
            return 'ui-icons';
          }
          
          // Radix UI
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }
          
          // Form libraries
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@hookform') ||
              id.includes('node_modules/zod')) {
            return 'forms';
          }
          
          // Editor (Jodit)
          if (id.includes('node_modules/jodit-react') || id.includes('node_modules/jodit')) {
            return 'editor';
          }
          
          // Other heavy libraries
          if (id.includes('node_modules/react-select') ||
              id.includes('node_modules/react-simple-maps') ||
              id.includes('node_modules/react-country-flag')) {
            return 'misc-vendor';
          }
          
          // Zustand and state management
          if (id.includes('node_modules/zustand')) {
            return 'state';
          }
          
          // Axios and HTTP
          if (id.includes('node_modules/axios')) {
            return 'http';
          }
          
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500, // Increase limit to 1.5MB
  },
  // base:"/admin/"
}));
