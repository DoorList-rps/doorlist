import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Blogger configuration
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

const BlogPost = () => {
  const { slug } = useParams();
  const postUrl = `http://doorlist.blogspot.com/${slug}`;

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      console.log('Fetching blog post from Blogger...');
      const response = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/byurl?url=${encodeURIComponent(postUrl)}&key=${API_KEY}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching blog post:', errorData);
        throw new Error('Failed to fetch blog post');
      }
      const data = await response.json();
      console.log('Fetched post:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <article className="max-w-4xl mx-auto prose lg:prose-xl">
          <h1>{post?.title}</h1>
          <div className="text-sm text-gray-500 mb-8">
            <span>{post?.author?.displayName}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post?.published).toLocaleDateString()}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post?.content }} />
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;