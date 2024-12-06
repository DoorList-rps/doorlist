import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Blogger configuration
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

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
      return data.items;
    },
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Real Estate Education | DoorList Learning Center</title>
        <meta name="description" content="Expand your knowledge of real estate investing with expert insights, guides, and educational resources from DoorList." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-4">Education Center</h1>
          <p className="text-xl text-gray-600 mb-12">
            Learn about real estate investing through our comprehensive guides and articles.
          </p>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-8">
              {posts?.map((post) => {
                const postSlug = post.url.split('/').pop();
                return (
                  <article key={post.id} className="border-b border-gray-200 pb-8">
                    <h2 className="text-2xl font-semibold text-doorlist-navy mb-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <span>{post.author.displayName}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.published).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {post.content
                        .replace(/<[^>]*>/g, '')
                        .substring(0, 200)}...
                    </p>
                    <Link to={`/education/${postSlug}`}>
                      <Button variant="outline">Read More</Button>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Education;