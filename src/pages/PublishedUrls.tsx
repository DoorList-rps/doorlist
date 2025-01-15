import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const generateSitemapXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Published URLs | DoorList</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-doorlist-navy mb-8">Published URLs (Sitemap Format)</h1>
        <Card className="w-full">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-[600px]">
                <p>Loading URLs...</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <pre className="text-sm font-mono whitespace-pre overflow-x-auto">
                  {generateSitemapXml()}
                </pre>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PublishedUrls;