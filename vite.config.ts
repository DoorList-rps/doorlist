import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-sitemap',
      writeBundle: () => {
        if (process.env.NODE_ENV === 'production') {
          console.log('Starting sitemap generation...');
          try {
            // Define all static URLs
            const domain = process.env.VITE_SITE_URL || 'https://doorlist.com';
            const urls = [
              { url: '/', changefreq: 'daily', priority: 1.0 },
              { url: '/investments', changefreq: 'daily', priority: 0.9 },
              { url: '/sponsors', changefreq: 'daily', priority: 0.9 },
              { url: '/education', changefreq: 'daily', priority: 0.9 },
              { url: '/about', changefreq: 'monthly', priority: 0.7 },
              { url: '/calculator', changefreq: 'monthly', priority: 0.7 },
              { url: '/contact', changefreq: 'monthly', priority: 0.7 },
              { url: '/faq', changefreq: 'monthly', priority: 0.7 },
              { url: '/privacy', changefreq: 'monthly', priority: 0.5 },
              { url: '/terms', changefreq: 'monthly', priority: 0.5 },
            ];

            // Generate sitemap XML
            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, changefreq, priority }) => `  <url>
    <loc>${domain}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

            // Ensure the public directory exists
            const publicDir = path.resolve(__dirname, 'public');
            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true });
            }

            // Write sitemap to public directory
            const sitemapPath = path.join(publicDir, 'sitemap.xml');
            fs.writeFileSync(sitemapPath, sitemap);
            
            console.log('Sitemap generated successfully!');
            console.log('Sitemap location:', sitemapPath);
            console.log('Sitemap content:', sitemap);
          } catch (error) {
            console.error('Error generating sitemap:', error);
            throw error;
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