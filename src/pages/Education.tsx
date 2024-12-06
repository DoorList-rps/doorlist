import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Blogger configuration
const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';

// Helper function to extract text content from HTML
const extractTextFromHtml = (html: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Helper function to extract first image URL from HTML content
const extractFirstImageUrl = (html: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const firstImg = tempDiv.querySelector('img');
  return firstImg?.src || '/placeholder.svg';
};

const Education = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      console.log('Fetching blog posts from Blogger...');
      const response = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching blog posts:', errorData);
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      console.log('Fetched posts:', data);
      return data.items;
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-6">
            Learn About Investing in Real Estate Through DoorList
          </h1>
          <p className="text-xl text-gray-600">
            We believe informed investors are more likely to make sound investment decisions and have a better understanding of the real estate market. By providing educational resources, we aim to empower our users to make informed choices and become more knowledgeable about the world of passive real estate investing.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map((post) => {
              const textContent = extractTextFromHtml(post.content);
              const imageUrl = extractFirstImageUrl(post.content);
              return (
                <Link 
                  key={post.id} 
                  to={`/education/${post.url.split('/').pop()}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-doorlist-navy mb-2 group-hover:text-doorlist-salmon transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4">
                        {textContent.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{post.author.displayName}</span>
                        <span>
                          {new Date(post.published).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Education;