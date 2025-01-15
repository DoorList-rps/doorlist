import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

interface SitemapUrl {
  loc: string;
  changefreq: string;
  priority: string;
}

const PublishedUrls = () => {
  const [urls, setUrls] = useState<SitemapUrl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUrls = async () => {
      try {
        setLoading(true);
        
        // Static routes with their priorities and change frequencies
        const staticUrls: SitemapUrl[] = [
          { loc: 'https://doorlist.com/', changefreq: 'daily', priority: '1.0' },
          { loc: 'https://doorlist.com/investments', changefreq: 'daily', priority: '0.9' },
          { loc: 'https://doorlist.com/sponsors', changefreq: 'daily', priority: '0.9' },
          { loc: 'https://doorlist.com/education', changefreq: 'daily', priority: '0.9' },
          { loc: 'https://doorlist.com/about', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://doorlist.com/calculator', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://doorlist.com/contact', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://doorlist.com/faq', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://doorlist.com/privacy', changefreq: 'monthly', priority: '0.5' },
          { loc: 'https://doorlist.com/terms', changefreq: 'monthly', priority: '0.5' },
        ];

        // Fetch approved sponsors
        const { data: sponsors } = await supabase
          .from('sponsors')
          .select('slug')
          .eq('approved', true);

        const sponsorUrls: SitemapUrl[] = (sponsors || []).map(sponsor => ({
          loc: `https://doorlist.com/sponsors/${sponsor.slug}`,
          changefreq: 'weekly',
          priority: '0.8'
        }));

        // Fetch approved investments
        const { data: investments } = await supabase
          .from('investments')
          .select('slug')
          .eq('approved', true);

        const investmentUrls: SitemapUrl[] = (investments || []).map(investment => ({
          loc: `https://doorlist.com/investments/${investment.slug}`,
          changefreq: 'weekly',
          priority: '0.8'
        }));

        // Fetch blog posts from Blogger API
        const blogResponse = await fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=500`
        );
        
        let blogUrls: SitemapUrl[] = [];
        if (blogResponse.ok) {
          const blogData = await blogResponse.json();
          blogUrls = (blogData.items || []).map((post: any) => ({
            loc: `https://doorlist.com/education/${post.url.split('/').pop()}`,
            changefreq: 'monthly',
            priority: '0.7'
          }));
        }

        // Combine all URLs and sort by priority (descending) then alphabetically
        const allUrls = [...staticUrls, ...sponsorUrls, ...investmentUrls, ...blogUrls]
          .sort((a, b) => {
            const priorityDiff = Number(b.priority) - Number(a.priority);
            if (priorityDiff !== 0) return priorityDiff;
            return a.loc.localeCompare(b.loc);
          });

        setUrls(allUrls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching URLs:', error);
        setLoading(false);
      }
    };

    fetchAllUrls();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Clear existing content
      document.documentElement.innerHTML = '';
      
      // Create XML processing instruction
      const xmlPI = document.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
      document.insertBefore(xmlPI, document.firstChild);
      
      // Set content type
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'application/xml; charset=utf-8';
      document.head.appendChild(meta);
    }
  }, []);

  // Generate XML content
  const generateXmlContent = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    if (typeof document !== 'undefined') {
      document.open('text/xml');
      document.write(xmlContent);
      document.close();
    }
  };

  // Effect to render XML content when URLs are loaded
  useEffect(() => {
    if (!loading && urls.length > 0) {
      generateXmlContent();
    }
  }, [loading, urls]);

  return null;
};

export default PublishedUrls;