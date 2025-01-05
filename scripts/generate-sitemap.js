import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use environment variable for domain or fallback to localhost for development
const DOMAIN = process.env.VITE_SITE_URL || 'http://localhost:8080';

// Define all static URLs
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

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');
    console.log('Using domain:', DOMAIN);
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, changefreq, priority }) => `  <url>
    <loc>${DOMAIN}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    // Write sitemap to public directory
    const sitemapPath = join(__dirname, '../public/sitemap.xml');
    writeFileSync(sitemapPath, sitemap);
    
    console.log(`Sitemap generated successfully with ${urls.length} URLs`);
    console.log('Location:', sitemapPath);
    console.log('Content:', sitemap);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Execute the sitemap generation
generateSitemap();