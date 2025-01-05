import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use environment variable for domain or fallback to localhost for development
const DOMAIN = process.env.VITE_SITE_URL || 'http://localhost:8080';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Blogger API configuration
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

// Define static URLs
const staticUrls = [
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

async function fetchBlogPosts() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?maxResults=500&key=${API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    const data = await response.json();
    return (data.items || []).map(post => ({
      url: `/education/${post.url.split('/').pop()}`,
      changefreq: 'weekly',
      priority: 0.8
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function fetchInvestments() {
  try {
    const { data: investments, error } = await supabase
      .from('investments')
      .select('slug')
      .eq('approved', true);
    
    if (error) throw error;
    
    return investments.map(investment => ({
      url: `/investments/${investment.slug}`,
      changefreq: 'daily',
      priority: 0.9
    }));
  } catch (error) {
    console.error('Error fetching investments:', error);
    return [];
  }
}

async function fetchSponsors() {
  try {
    const { data: sponsors, error } = await supabase
      .from('sponsors')
      .select('slug')
      .eq('approved', true);
    
    if (error) throw error;
    
    return sponsors.map(sponsor => ({
      url: `/sponsors/${sponsor.slug}`,
      changefreq: 'weekly',
      priority: 0.8
    }));
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return [];
  }
}

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');
    console.log('Using domain:', DOMAIN);
    
    // Fetch all dynamic URLs
    const [blogPosts, investments, sponsors] = await Promise.all([
      fetchBlogPosts(),
      fetchInvestments(),
      fetchSponsors()
    ]);
    
    // Combine static and dynamic URLs
    const allUrls = [
      ...staticUrls,
      ...blogPosts,
      ...investments,
      ...sponsors
    ];
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, changefreq, priority }) => `  <url>
    <loc>${DOMAIN}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    // Write sitemap to public directory
    const sitemapPath = join(__dirname, '../public/sitemap.xml');
    writeFileSync(sitemapPath, sitemap);
    
    console.log(`Sitemap generated successfully with ${allUrls.length} URLs`);
    console.log('Location:', sitemapPath);
    console.log('Content:', sitemap);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Execute the sitemap generation
generateSitemap();