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

const DOMAIN = 'https://doorlist.com';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllBlogPosts() {
  const allPosts = [];
  let pageToken = null;
  let totalAttempts = 0;
  const maxAttempts = 10; // Prevent infinite loops

  try {
    do {
      if (totalAttempts >= maxAttempts) {
        console.warn(`Reached maximum attempts (${maxAttempts}) while fetching blog posts`);
        break;
      }

      const url = new URL(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts`);
      url.searchParams.append('key', API_KEY);
      url.searchParams.append('maxResults', '500');
      url.searchParams.append('status', 'live');
      if (pageToken) {
        url.searchParams.append('pageToken', pageToken);
      }

      console.log(`Fetching blog posts (attempt ${totalAttempts + 1})${pageToken ? ' with page token' : ''}`);
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch blog posts: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Fetched ${data.items?.length || 0} posts in this batch`);
      
      if (data.items && data.items.length > 0) {
        allPosts.push(...data.items);
      }
      
      pageToken = data.nextPageToken;
      totalAttempts++;

      // Add a delay between requests to avoid rate limiting
      if (pageToken) {
        await delay(1000);
      }
    } while (pageToken);

    console.log(`Total blog posts fetched: ${allPosts.length}`);
    return allPosts.map(post => ({
      url: `/education/${post.url.split('/').pop()}`,
      changefreq: 'monthly',
      priority: '0.7'
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function fetchAllApprovedSponsors() {
  try {
    console.log('Fetching all approved sponsors...');
    const { data: sponsors, error } = await supabase
      .from('sponsors')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null);

    if (error) throw error;
    
    console.log(`Found ${sponsors?.length || 0} approved sponsors`);
    return sponsors?.map(sponsor => ({
      url: `/sponsors/${sponsor.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    })) || [];
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return [];
  }
}

async function fetchAllApprovedInvestments() {
  try {
    console.log('Fetching all approved investments...');
    const { data: investments, error } = await supabase
      .from('investments')
      .select('slug')
      .eq('approved', true)
      .not('slug', 'is', null);

    if (error) throw error;
    
    console.log(`Found ${investments?.length || 0} approved investments`);
    return investments?.map(investment => ({
      url: `/investments/${investment.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    })) || [];
  } catch (error) {
    console.error('Error fetching investments:', error);
    return [];
  }
}

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');

    // Define static URLs with their properties
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
    console.log('Fetching all dynamic data...');
    const [sponsorUrls, investmentUrls, blogUrls] = await Promise.all([
      fetchAllApprovedSponsors(),
      fetchAllApprovedInvestments(),
      fetchAllBlogPosts()
    ]);

    // Combine all URLs
    const allUrls = [...staticUrls, ...sponsorUrls, ...investmentUrls, ...blogUrls];

    // Log detailed URL counts
    console.log('\nURL Summary:');
    console.log('-------------');
    console.log('Static pages:', staticUrls.length);
    console.log('Sponsor pages:', sponsorUrls.length);
    console.log('Investment pages:', investmentUrls.length);
    console.log('Blog posts:', blogUrls.length);
    console.log('Total URLs:', allUrls.length);

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(entry => `  <url>
    <loc>${DOMAIN}${entry.url}</loc>
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
    
    // Log success with file location
    console.log('\nSitemap generated successfully!');
    console.log('Location:', sitemapPath);
    console.log('\nFirst 5 URLs in sitemap:');
    allUrls.slice(0, 5).forEach(entry => console.log(`${DOMAIN}${entry.url}`));
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the sitemap generation
generateSitemap();