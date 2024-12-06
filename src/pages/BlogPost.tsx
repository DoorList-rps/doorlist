import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Blogger configuration
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

const BlogPost = () => {
  const { slug = '' } = useParams();
  
  // Remove .html extension if present for the API query
  const cleanSlug = slug.replace('.html', '');

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

  if (isLoading) {
    return (
      <div>
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

  const post = posts?.find(p => {
    const postSlug = p.url.split('/').pop()?.replace('.html', '');
    return postSlug === cleanSlug;
  });

  if (!post) {
    return (
      <div>
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
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <article className="max-w-4xl mx-auto prose lg:prose-xl">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>{post.author.displayName}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.published).toLocaleDateString()}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;