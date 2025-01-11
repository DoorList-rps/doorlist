import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogPostContent from "@/components/blog/BlogPostContent";

const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

const BlogPost = () => {
  const { slug = '' } = useParams();
  const cleanSlug = slug.replace('.html', '');
  
  // Create a more precise search query from the slug
  const searchQuery = cleanSlug
    .split('-')
    .join(' ');

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', cleanSlug],
    queryFn: async () => {
      console.log('Searching for post with query:', searchQuery);
      
      try {
        // First try to get an exact URL match
        const exactResponse = await fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/search?q="/${cleanSlug}.html"&key=${API_KEY}`
        );
        
        if (exactResponse.ok) {
          const exactData = await exactResponse.json();
          console.log('Exact URL search results:', exactData);
          
          if (exactData.items && exactData.items.length > 0) {
            return exactData.items[0];
          }
        }

        // If no exact match, try title search
        const titleResponse = await fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/search?q="${searchQuery}"&key=${API_KEY}`
        );
        
        if (!titleResponse.ok) {
          console.error('Title search response not OK:', await titleResponse.text());
          throw new Error('Failed to fetch blog post');
        }
        
        const titleData = await titleResponse.json();
        console.log('Title search results:', titleData);
        
        if (titleData.items && titleData.items.length > 0) {
          // Find the post that best matches our slug
          const matchingPost = titleData.items.find(post => {
            const postSlug = post.url.split('/').pop()?.replace('.html', '') || '';
            // Check for exact match first
            if (postSlug === cleanSlug) return true;
            // Then check if the title closely matches our search query
            const postTitle = post.title.toLowerCase();
            const searchTerms = searchQuery.toLowerCase().split(' ');
            return searchTerms.every(term => postTitle.includes(term));
          });
          
          return matchingPost || titleData.items[0];
        }
        
        throw new Error('Blog post not found');
      } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
      }
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
        <title>{`${post?.title || 'Article'} | DoorList Education`}</title>
        <meta name="description" content={post?.content?.replace(/<[^>]*>/g, '').substring(0, 160)} />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <article className="max-w-4xl mx-auto">
          <BlogPostHeader
            title={post?.title}
            author={post?.author?.displayName}
            published={post?.published}
            imageUrl={post?.images?.[0]?.url}
          />
          <BlogPostContent content={post?.content} />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;