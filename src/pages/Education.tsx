import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Education = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.map((post) => (
                <Link key={post.id} to={`/education/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    {post.image_url && (
                      <div 
                        className="h-48 bg-cover bg-center rounded-t-lg"
                        style={{ 
                          backgroundImage: `url(${post.image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    )}
                    <CardContent className="p-4">
                      <h2 className="text-xl font-semibold text-doorlist-navy mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 150)}...
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