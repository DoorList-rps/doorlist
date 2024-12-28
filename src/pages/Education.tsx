import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

// Default images to use when blog post doesn't have an image
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
];

const Education = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const response = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      return data.items || [];
    },
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Real Estate Education | DoorList Learning Center</title>
        <meta 
          name="description" 
          content="Expand your knowledge of real estate investing with expert insights, guides, and educational resources from DoorList." 
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-4">Education Center</h1>
          <p className="text-xl text-gray-600 mb-12">
            Learn about real estate investing through our comprehensive guides and articles.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {posts?.map((post, index) => (
                <Link key={post.id} to={`/education/${post.url.split('/').pop()}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    <div 
                      className="h-48 bg-cover bg-center rounded-t-lg"
                      style={{ 
                        backgroundImage: `url(${post.images?.[0]?.url || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]})`,
                      }}
                    />
                    <CardContent className="p-4">
                      <h2 className="text-xl font-semibold text-doorlist-navy mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        {post.author?.displayName && <span>{post.author.displayName}</span>}
                        {post.published && (
                          <>
                            {post.author?.displayName && <span className="mx-2">•</span>}
                            <span>{new Date(post.published).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600 line-clamp-3">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Education;