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
          execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
          console.log('Sitemap generated successfully!');
        } catch (error) {
          console.error('Error generating sitemap:', error);
          process.exit(1); // Exit with error to indicate build failure
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