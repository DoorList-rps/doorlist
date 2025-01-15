import { supabase } from "@/integrations/supabase/client";
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://doorlist.com';

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

    // Fetch published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug')
      .not('published_at', 'is', null);

    if (blogError) {
      console.error('Error fetching blog posts:', blogError);
      return;
    }

    console.log(`Found: ${sponsors?.length || 0} sponsors, ${investments?.length || 0} investments, ${blogPosts?.length || 0} blog posts`);

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
    blogPosts?.forEach(({ slug }) => {
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

// Execute the function when this module is imported
generateSitemap().catch(console.error);