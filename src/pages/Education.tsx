import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import BlogPostImportForm from "@/components/education/BlogPostImportForm";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Education = () => {
  const { data: posts, isLoading, refetch } = useQuery({
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

  const session = useSession();
  const { toast } = useToast();
  const isAuthorizedUser = session?.user?.email === 'ryan.sudeck@gmail.com';

  const fetchAllContent = async () => {
    const urls = [
      'https://static.semrush.com/contentshake/articles/5acfd47b-2d2d-40f2-9d30-bbc69fb1daff',
      'https://static.semrush.com/contentshake/articles/bb5d3b46-195c-4b66-a337-81a519852892',
      'https://static.semrush.com/contentshake/articles/90be6bbd-9706-49a9-9041-61b083d6d61f'
    ];

    try {
      for (const url of urls) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch content from ${url}`);
        
        const content = await response.text();
        const urlParts = url.split('/');
        const slug = urlParts[urlParts.length - 1];
        
        const { error } = await supabase
          .from('blog_posts')
          .update({ content })
          .eq('slug', slug);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "All blog posts have been updated successfully",
      });

      refetch();
    } catch (error) {
      console.error('Batch import error:', error);
      toast({
        title: "Error",
        description: "Failed to update some blog posts. Please try again.",
        variant: "destructive",
      });
    }
  };

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

          {isAuthorizedUser && (
            <div className="mb-8">
              <BlogPostImportForm />
              <div className="mt-4 text-center">
                <Button onClick={fetchAllContent}>
                  Fetch All ContentShake Articles
                </Button>
              </div>
            </div>
          )}

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
                        {post.author && <span>{post.author}</span>}
                        {post.published_at && (
                          <>
                            {post.author && <span className="mx-2">•</span>}
                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                          </>
                        )}
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