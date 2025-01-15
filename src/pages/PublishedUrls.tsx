import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
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

        setUrls(extractedUrls);
      } catch (error) {
        console.error('Error fetching sitemap:', error);
      }
    };

    fetchSitemap();
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
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PublishedUrls;