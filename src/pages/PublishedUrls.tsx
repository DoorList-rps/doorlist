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
        
        // Fetch static routes from sitemap.xml
        const response = await fetch('/sitemap.xml');
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const urlElements = xmlDoc.getElementsByTagName('url');
        
        const extractedUrls: SitemapUrl[] = Array.from(urlElements).map(urlElement => ({
          loc: urlElement.getElementsByTagName('loc')[0]?.textContent || '',
          changefreq: urlElement.getElementsByTagName('changefreq')[0]?.textContent || '',
          priority: urlElement.getElementsByTagName('priority')[0]?.textContent || ''
        }));

        // Fetch blog posts from Blogger API
        const blogResponse = await fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=500`
        );
        
        if (blogResponse.ok) {
          const blogData = await blogResponse.json();
          const blogUrls = (blogData.items || []).map((post: any) => ({
            loc: `https://doorlist.com/education/${post.url.split('/').pop()}`,
            changefreq: 'monthly',
            priority: '0.7'
          }));
          extractedUrls.push(...blogUrls);
        }

        // Fetch approved sponsors
        const { data: sponsors } = await supabase
          .from('sponsors')
          .select('slug')
          .eq('approved', true);

        if (sponsors) {
          const sponsorUrls = sponsors.map(sponsor => ({
            loc: `https://doorlist.com/sponsors/${sponsor.slug}`,
            changefreq: 'weekly',
            priority: '0.8'
          }));
          extractedUrls.push(...sponsorUrls);
        }

        // Fetch approved investments
        const { data: investments } = await supabase
          .from('investments')
          .select('slug')
          .eq('approved', true);

        if (investments) {
          const investmentUrls = investments.map(investment => ({
            loc: `https://doorlist.com/investments/${investment.slug}`,
            changefreq: 'weekly',
            priority: '0.8'
          }));
          extractedUrls.push(...investmentUrls);
        }

        // Sort URLs by priority (descending) and then alphabetically
        const sortedUrls = extractedUrls.sort((a, b) => {
          const priorityDiff = Number(b.priority) - Number(a.priority);
          if (priorityDiff !== 0) return priorityDiff;
          return a.loc.localeCompare(b.loc);
        });

        setUrls(sortedUrls);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUrls();
  }, []);

  // Set content type header
  useEffect(() => {
    document.contentType = 'application/xml';
  }, []);

  if (loading) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>';
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export default PublishedUrls;