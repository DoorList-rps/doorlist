import { supabase } from "@/integrations/supabase/client";
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://doorlist.com';
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

export async function generateSitemap() {
  console.log('Starting sitemap generation...');
  
  try {
    // Fetch approved sponsors
    const { data: sponsors, error: sponsorsError } = await supabase
      .from('sponsors')
      .select('slug')
      .eq('approved', true);

    if (sponsorsError) {
      console.error('Error fetching sponsors:', sponsorsError);
      return;
    }

    // Fetch approved investments
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('slug')
      .eq('approved', true);

    if (investmentsError) {
      console.error('Error fetching investments:', investmentsError);
      return;
    }

    // Fetch blog posts from Blogger API
    const blogPosts = await fetchBlogPosts();
    console.log(`Found ${blogPosts.length} blog posts from Blogger API`);

    console.log(`Found: ${sponsors?.length || 0} sponsors, ${investments?.length || 0} investments, ${blogPosts.length} blog posts`);

    const staticUrls = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/investments', changefreq: 'daily', priority: '0.9' },
      { url: '/sponsors', changefreq: 'daily', priority: '0.9' },
      { url: '/education', changefreq: 'daily', priority: '0.9' },
      { url: '/about', changefreq: 'monthly', priority: '0.7' },
      { url: '/calculator', changefreq: 'monthly', priority: '0.7' },
      { url: '/contact', changefreq: 'monthly', priority: '0.7' },
      { url: '/faq', changefreq: 'monthly', priority: '0.7' },
      { url: '/privacy', changefreq: 'monthly', priority: '0.5' },
      { url: '/terms', changefreq: 'monthly', priority: '0.5' },
    ];

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static URLs
    staticUrls.forEach(({ url, changefreq, priority }) => {
      sitemapContent += `  <url>
    <loc>${SITE_URL}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
    });

    // Add sponsor URLs
    sponsors?.forEach(({ slug }) => {
      sitemapContent += `  <url>
    <loc>${SITE_URL}/sponsors/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add investment URLs
    investments?.forEach(({ slug }) => {
      sitemapContent += `  <url>
    <loc>${SITE_URL}/investments/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add blog post URLs
    blogPosts.forEach((post) => {
      const slug = post.url.split('/').pop();
      sitemapContent += `  <url>
    <loc>${SITE_URL}/education/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    sitemapContent += `</urlset>`;

    // Write to public/sitemap.xml
    fs.writeFileSync(
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      sitemapContent
    );

    console.log('Sitemap generated successfully!');
    return sitemapContent;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return null;
  }
}

async function fetchBlogPosts() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=500`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Execute the function when this module is imported
generateSitemap().catch(console.error);