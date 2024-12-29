import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BLOG_ID = '1694084439153189152';
const API_KEY = 'AIzaSyA1vMBgHX4iN8zs-PN7UDQfGp6AhIMq6G4';
const POSTS_PER_PAGE = 50; // Maximum allowed by Blogger API

// Function to extract the first image URL from HTML content
const extractFirstImage = (content: string): string | undefined => {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
};

// Function to extract categories from content
const extractCategories = (posts: any[]): string[] => {
  const categoriesSet = new Set<string>();
  posts?.forEach(post => {
    const labels = post.labels || [];
    labels.forEach((label: string) => categoriesSet.add(label));
  });
  return Array.from(categoriesSet);
};

const Education = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      console.log('Fetching blog posts...');
      const response = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?maxResults=${POSTS_PER_PAGE}&key=${API_KEY}`
      );
      if (!response.ok) {
        console.error('Failed to fetch blog posts:', await response.text());
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      console.log(`Fetched ${data.items?.length || 0} posts`);
      return data.items || [];
    },
  });

  const categories = useMemo(() => {
    return extractCategories(posts || []);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts?.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
        (post.labels && post.labels.includes(selectedCategory));
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

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
          <p className="text-xl text-gray-600 mb-8">
            Learn about real estate investing through our comprehensive guides and articles.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="w-full md:w-2/3">
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCategory !== 'all' && (
            <div className="mb-6">
              <Badge variant="secondary" className="text-sm">
                {selectedCategory}
              </Badge>
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {filteredPosts?.map((post) => {
                  const imageUrl = extractFirstImage(post.content);
                  return (
                    <Link key={post.id} to={`/education/${post.url.split('/').pop()}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                        <div 
                          className="h-48 bg-cover bg-center rounded-t-lg"
                          style={{ 
                            backgroundImage: `url(${imageUrl})`,
                          }}
                        />
                        <CardContent className="p-4">
                          <h2 className="text-xl font-semibold text-doorlist-navy mb-2 line-clamp-2">
                            {post.title}
                          </h2>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.labels?.map((label: string) => (
                              <Badge key={label} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            {post.author?.displayName && <span>{post.author.displayName}</span>}
                            {post.published && (
                              <>
                                {post.author?.displayName && <span className="mx-2">•</span>}
                                <span>{new Date(post.published).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          <p className="text-gray-600 line-clamp-3">
                            {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
              {filteredPosts?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600">No articles found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Education;