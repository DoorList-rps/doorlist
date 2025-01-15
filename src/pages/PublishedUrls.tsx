import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        
        // Fetch sitemap.xml for static routes
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

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Published URLs | DoorList</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-doorlist-navy mb-8">Published URLs</h1>
        <Card className="w-full">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-[600px]">
                <p>Loading URLs...</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-4">URL</th>
                      <th className="pb-4">Change Frequency</th>
                      <th className="pb-4">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-4">
                          <a 
                            href={url.loc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {url.loc}
                          </a>
                        </td>
                        <td className="py-4">{url.changefreq}</td>
                        <td className="py-4">{url.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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