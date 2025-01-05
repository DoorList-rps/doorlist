import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-sitemap',
      closeBundle: async () => {
        if (process.env.NODE_ENV === 'production') {
          console.log('Starting sitemap generation...');
          try {
            const { execSync } = await import('child_process');
            // Pass all necessary environment variables to the script
            const env = { 
              ...process.env, 
              VITE_SITE_URL: process.env.VITE_SITE_URL || 'http://localhost:8080',
              SUPABASE_URL: process.env.SUPABASE_URL,
              SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
            };
            execSync('node scripts/generate-sitemap.js', { stdio: 'inherit', env });
            console.log('Sitemap generated successfully!');
          } catch (error) {
            console.error('Error generating sitemap:', error);
            process.exit(1);
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});