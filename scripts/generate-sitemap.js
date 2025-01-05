import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const supabaseUrl = process.env.SUPABASE_URL || "https://iavmizyezxogctfrbvxh.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm1penllenhvZ2N0ZnJidnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5OTEwNzgsImV4cCI6MjA0ODU2NzA3OH0.Mk825aTDa3FSlUPkKXPk0pOsr7xaYEloFAF5Rd9wdAw";

// Blogger configuration
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchApprovedSponsors() {
  console.log('Fetching approved sponsors...');
  const { data: sponsors, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('approved', true);

  if (error) {
    console.error('Error fetching sponsors:', error);
    throw error;
  }

  console.log(`Found ${sponsors?.length || 0} approved sponsors`);
  return sponsors || [];
}

async function fetchApprovedInvestments() {
  console.log('Fetching approved investments...');
  const { data: investments, error } = await supabase
    .from('investments')
    .select('*')
    .eq('approved', true);

  if (error) {
    console.error('Error fetching investments:', error);
    throw error;
  }

  console.log(`Found ${investments?.length || 0} approved investments`);
  return investments || [];
}

async function fetchBlogPosts() {
  console.log('Fetching blog posts from Blogger...');
  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=500`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    const data = await response.json();
    const posts = data.items || [];
    
    const processedPosts = posts.map(post => ({
      ...post,
      slug: post.url.split('/').pop()
    }));

    console.log(`Found ${processedPosts.length} blog posts`);
    return processedPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');

    // Get static URLs
    const staticUrls = [
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
    ];

    // Fetch all dynamic data concurrently
    console.log('Fetching dynamic data...');
    const [sponsors, investments, blogPosts] = await Promise.all([
      fetchApprovedSponsors(),
      fetchApprovedInvestments(),
      fetchBlogPosts()
    ]);

    // Generate sponsor URLs
    const sponsorUrls = sponsors.map(sponsor => ({
      url: `/sponsors/${sponsor.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    // Generate investment URLs
    const investmentUrls = investments.map(investment => ({
      url: `/investments/${investment.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    // Generate blog post URLs
    const blogUrls = blogPosts.map(post => ({
      url: `/education/${post.slug}`,
      changefreq: 'monthly',
      priority: '0.7'
    }));

    // Combine all URLs
    const allUrls = [...staticUrls, ...sponsorUrls, ...investmentUrls, ...blogUrls];

    console.log('URL Summary:', {
      total: allUrls.length,
      static: staticUrls.length,
      sponsors: sponsorUrls.length,
      investments: investmentUrls.length,
      blog: blogUrls.length
    });

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(entry => `  <url>
    <loc>https://doorlist.com${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Get the directory of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicDir = path.join(__dirname, '..', 'public');
    
    // Ensure the public directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // Write sitemap file
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemap, 'utf8');
    
    console.log(`Successfully wrote sitemap.xml with ${allUrls.length} URLs`);
    console.log('All URLs included:', allUrls.map(u => `https://doorlist.com${u.url}`).join('\n'));
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the sitemap generation
generateSitemap();