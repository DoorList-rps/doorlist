import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from 'child_process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add fallback configuration for development server
    historyApiFallback: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'generate-sitemap',
      closeBundle: async () => {
        console.log('Generating sitemap...');
        try {
          execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
          console.log('Sitemap generated successfully!');
        } catch (error) {
          console.error('Error generating sitemap:', error);
          // Don't throw error to allow build to complete
        }
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));