import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'generate-sitemap',
      closeBundle: async () => {
        console.log('Starting sitemap generation...');
        try {
          const { execSync } = await import('child_process');
          // Pass the VITE_SITE_URL environment variable to the script
          const env = { ...process.env, VITE_SITE_URL: process.env.VITE_SITE_URL || 'http://localhost:8080' };
          execSync('node scripts/generate-sitemap.js', { stdio: 'inherit', env });
          console.log('Sitemap generated successfully!');
        } catch (error) {
          console.error('Error generating sitemap:', error);
          process.exit(1);
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