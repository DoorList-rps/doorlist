import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use environment variable for domain or fallback to localhost for development
const DOMAIN = process.env.VITE_SITE_URL || 'http://localhost:8080';

// Define all possible URLs
const urls = [
  // Static pages
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/investments', changefreq: 'daily', priority: '0.9' },
  { url: '/sponsors', changefreq: 'daily', priority: '0.9' },
  { url: '/education', changefreq: 'weekly', priority: '0.8' },
  { url: '/about', changefreq: 'monthly', priority: '0.7' },
  { url: '/calculator', changefreq: 'monthly', priority: '0.7' },
  { url: '/contact', changefreq: 'monthly', priority: '0.6' },
  { url: '/faq', changefreq: 'monthly', priority: '0.6' },
  { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { url: '/terms', changefreq: 'yearly', priority: '0.3' },
  { url: '/submit-investment', changefreq: 'monthly', priority: '0.5' },
  
  // Education pages (blog posts)
  { url: '/education/real-estate-investing-basics', changefreq: 'monthly', priority: '0.7' },
  { url: '/education/understanding-reits', changefreq: 'monthly', priority: '0.7' },
  { url: '/education/commercial-real-estate-101', changefreq: 'monthly', priority: '0.7' },
  { url: '/education/passive-income-through-real-estate', changefreq: 'monthly', priority: '0.7' },
  { url: '/education/accredited-investor-guide', changefreq: 'monthly', priority: '0.7' },
  
  // Sponsor pages
  { url: '/sponsors/acretrader', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/arrived-homes', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/cadre', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/crowdstreet', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/equity-multiple', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/fundrise', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/groundfloor', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/jamestown-invest', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/realty-mogul', changefreq: 'weekly', priority: '0.8' },
  { url: '/sponsors/streitwise', changefreq: 'weekly', priority: '0.8' },
  
  // Investment pages
  { url: '/investments/multifamily-value-add-atlanta', changefreq: 'weekly', priority: '0.8' },
  { url: '/investments/self-storage-development-dallas', changefreq: 'weekly', priority: '0.8' },
  { url: '/investments/retail-strip-center-phoenix', changefreq: 'weekly', priority: '0.8' },
  { url: '/investments/industrial-warehouse-miami', changefreq: 'weekly', priority: '0.8' },
  { url: '/investments/office-building-chicago', changefreq: 'weekly', priority: '0.8' }
];

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');
    console.log('Using domain:', DOMAIN);
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(entry => `  <url>
    <loc>${DOMAIN}${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Write sitemap file
    const publicDir = join(dirname(dirname(__filename)), 'public');
    await fs.mkdir(publicDir, { recursive: true });
    
    const sitemapPath = join(publicDir, 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemap, 'utf8');
    
    console.log(`Sitemap generated successfully with ${urls.length} URLs`);
    console.log('Location:', sitemapPath);
    console.log('Content:', sitemap);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the sitemap generation
generateSitemap();