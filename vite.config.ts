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
              SUPABASE_URL: "https://iavmizyezxogctfrbvxh.supabase.co",
              SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm1penllenhvZ2N0ZnJidnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5OTEwNzgsImV4cCI6MjA0ODU2NzA3OH0.Mk825aTDa3FSlUPkKXPk0pOsr7xaYEloFAF5Rd9wdAw"
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
  server: {
    port: 8080
  }
});