import React from 'react';

interface BlogPostHeaderProps {
  title: string;
  author?: string;
  published?: string;
  imageUrl?: string;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ 
  title, 
  author, 
  published,
  imageUrl 
}) => {
  return (
    <header className="mb-12">
      {imageUrl && (
        <div className="max-w-6xl mx-auto mb-8">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold text-doorlist-navy mb-4">{title}</h1>
      <div className="flex items-center text-gray-600">
        {author && <span>{author}</span>}
        {author && published && <span className="mx-2">•</span>}
        {published && (
          <span>{new Date(published).toLocaleDateString()}</span>
        )}
      </div>
    </header>
  );
};

export default BlogPostHeader;