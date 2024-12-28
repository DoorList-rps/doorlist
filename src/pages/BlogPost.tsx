import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Blogger configuration
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

const BlogPost = () => {
  const { slug = '' } = useParams();
  
  // Remove .html extension if present
  const cleanSlug = slug.replace('.html', '');

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', cleanSlug],
    queryFn: async () => {
      // First try to search for the post by path
      const searchResponse = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/search?q=${cleanSlug}&key=${API_KEY}`
      );
      
      if (!searchResponse.ok) {
        throw new Error('Failed to fetch blog post');
      }
      
      const searchData = await searchResponse.json();
      
      // If we found a matching post, return it
      if (searchData.items && searchData.items.length > 0) {
        return searchData.items[0];
      }
      
      throw new Error('Blog post not found');
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
        <meta name="description" content={post.content.replace(/<[^>]*>/g, '').substring(0, 160)} />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        {post.images?.[0] && (
          <div className="max-w-6xl mx-auto mb-12">
            <img 
              src={post.images[0].url} 
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
        <article className="max-w-4xl mx-auto prose lg:prose-xl">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-8">
            {post.author?.displayName && <span>{post.author.displayName}</span>}
            {post.author?.displayName && post.published && <span className="mx-2">•</span>}
            {post.published && (
              <span>{new Date(post.published).toLocaleDateString()}</span>
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