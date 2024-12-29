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
  
  // Convert slug to a more search-friendly format
  const searchTerms = cleanSlug
    .split('-')
    .filter(term => term.length > 3) // Only search for words longer than 3 characters
    .join(' OR '); // Use OR to make search more flexible

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', cleanSlug],
    queryFn: async () => {
      console.log('Searching for post with terms:', searchTerms);
      
      const searchResponse = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/search?q=${searchTerms}&key=${API_KEY}`
      );
      
      if (!searchResponse.ok) {
        console.error('Search response not OK:', await searchResponse.text());
        throw new Error('Failed to fetch blog post');
      }
      
      const searchData = await searchResponse.json();
      console.log('Search results:', searchData);
      
      if (searchData.items && searchData.items.length > 0) {
        // Find the post that best matches our slug
        const matchingPost = searchData.items.find(post => {
          const postSlug = post.url.split('/').pop()?.replace('.html', '') || '';
          // Check for exact match first
          if (postSlug === cleanSlug) return true;
          // Then check for partial matches
          const postWords = postSlug.split('-');
          const slugWords = cleanSlug.split('-');
          return slugWords.every(word => postWords.some(pw => pw.includes(word)));
        });
        
        return matchingPost || searchData.items[0];
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
        <article className="max-w-4xl mx-auto">
          <BlogPostHeader
            title={post.title}
            author={post.author?.displayName}
            published={post.published}
            imageUrl={post.images?.[0]?.url}
          />
          <BlogPostContent content={post.content} />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;