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

async function fetchAllBlogPosts(pageToken = null, allPosts = []) {
  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts`;
    const params = new URLSearchParams({
      key: API_KEY,
      maxResults: '500',
      status: 'live',
      ...(pageToken && { pageToken })
    });

    console.log(`Fetching blog posts${pageToken ? ' (page token: ' + pageToken + ')' : ''}...`);
    
    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Fetched ${data.items?.length || 0} posts in this batch`);
    
    if (data.items) {
      allPosts.push(...data.items);
    }
    
    if (data.nextPageToken) {
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchAllBlogPosts(data.nextPageToken, allPosts);
    }
    
    return allPosts.map(post => ({
      url: post.url,
      slug: post.url.split('/').pop()
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return allPosts;
  }
}

async function fetchAllApprovedSponsors() {
  try {
    console.log('Fetching all approved sponsors...');
    const { data: sponsors, error } = await supabase
      .from('sponsors')
      .select('slug')
      .eq('approved', true);

    if (error) throw error;
    
    console.log(`Found ${sponsors?.length || 0} approved sponsors`);
    return sponsors || [];
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    throw error;
  }
}

async function fetchAllApprovedInvestments() {
  try {
    console.log('Fetching all approved investments...');
    const { data: investments, error } = await supabase
      .from('investments')
      .select('slug')
      .eq('approved', true);

    if (error) throw error;
    
    console.log(`Found ${investments?.length || 0} approved investments`);
    return investments || [];
  } catch (error) {
    console.error('Error fetching investments:', error);
    throw error;
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

    // Fetch all dynamic data concurrently with proper error handling
    console.log('Fetching all dynamic data...');
    const [sponsors, investments, blogPosts] = await Promise.all([
      fetchAllApprovedSponsors().catch(error => {
        console.error('Error fetching sponsors:', error);
        return [];
      }),
      fetchAllApprovedInvestments().catch(error => {
        console.error('Error fetching investments:', error);
        return [];
      }),
      fetchAllBlogPosts().catch(error => {
        console.error('Error fetching blog posts:', error);
        return [];
      })
    ]);

    // Generate URLs for each content type
    const sponsorUrls = sponsors.map(sponsor => ({
      url: `/sponsors/${sponsor.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    const investmentUrls = investments.map(investment => ({
      url: `/investments/${investment.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    const blogUrls = blogPosts.map(post => ({
      url: `/education/${post.slug}`,
      changefreq: 'monthly',
      priority: '0.7'
    }));

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