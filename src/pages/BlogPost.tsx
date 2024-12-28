import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const BlogPost = () => {
  const { slug = '' } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div>
        <Helmet>
          <title>Loading Article | DoorList Education</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Helmet>
          <title>Article Not Found | DoorList Education</title>
          <meta name="description" content="The article you're looking for could not be found." />
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-red-600">Post not found</h1>
            <p className="mt-4">The blog post you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{`${post.title} | DoorList Education`}</title>
        <meta name="description" content={post.excerpt || post.content.substring(0, 160)} />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        {post.image_url && (
          <div className="max-w-6xl mx-auto mb-12">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
        <article className="max-w-4xl mx-auto prose lg:prose-xl">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-8">
            {post.author && <span>{post.author}</span>}
            {post.author && post.published_at && <span className="mx-2">•</span>}
            {post.published_at && (
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
            )}
          </div>
          <div 
            className="prose prose-lg prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;