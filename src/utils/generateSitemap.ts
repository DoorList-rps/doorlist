import { supabase } from "@/integrations/supabase/client";
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://doorlist.com';
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

interface SitemapUrl {
  loc: string;
  changefreq: string;
  priority: string;
}

export async function generateSitemap() {
  console.log('Starting sitemap generation...');
  
  try {
    // Static routes with their priorities and change frequencies
    const staticUrls: SitemapUrl[] = [
      { loc: '/', changefreq: 'daily', priority: '1.0' },
      { loc: '/investments', changefreq: 'daily', priority: '0.9' },
      { loc: '/sponsors', changefreq: 'daily', priority: '0.9' },
      { loc: '/education', changefreq: 'daily', priority: '0.9' },
      { loc: '/about', changefreq: 'monthly', priority: '0.7' },
      { loc: '/calculator', changefreq: 'monthly', priority: '0.7' },
      { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
      { loc: '/faq', changefreq: 'monthly', priority: '0.7' },
      { loc: '/privacy', changefreq: 'monthly', priority: '0.5' },
      { loc: '/terms', changefreq: 'monthly', priority: '0.5' },
    ];

    // Fetch approved sponsors
    const { data: sponsors } = await supabase
      .from('sponsors')
      .select('slug')
      .eq('approved', true);

    const sponsorUrls: SitemapUrl[] = (sponsors || []).map(sponsor => ({
      loc: `/sponsors/${sponsor.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    // Fetch approved investments
    const { data: investments } = await supabase
      .from('investments')
      .select('slug')
      .eq('approved', true);

    const investmentUrls: SitemapUrl[] = (investments || []).map(investment => ({
      loc: `/investments/${investment.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    // Fetch blog posts from Blogger API
    const blogPosts = await fetchBlogPosts();
    console.log(`Found ${blogPosts.length} blog posts from Blogger API`);

    const blogUrls: SitemapUrl[] = blogPosts.map((post: any) => {
      const slug = post.url.split('/').pop();
      return {
        loc: `/education/${slug}`,
        changefreq: 'monthly',
        priority: '0.7'
      };
    });

    // Combine all URLs and sort by priority (descending) then alphabetically
    const allUrls = [...staticUrls, ...sponsorUrls, ...investmentUrls, ...blogUrls]
      .sort((a, b) => {
        const priorityDiff = Number(b.priority) - Number(a.priority);
        if (priorityDiff !== 0) return priorityDiff;
        return a.loc.localeCompare(b.loc);
      });

    // Generate sitemap content
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add all URLs to sitemap
    allUrls.forEach(({ loc, changefreq, priority }) => {
      sitemapContent += `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
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