import React from 'react';

interface BlogPostContentProps {
  content: string;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ content }) => {
  // Process content to ensure proper heading tags
  const processContent = (htmlContent: string) => {
    // Replace Blogger's style-based headings with proper heading tags
    let processed = htmlContent
      // Convert h2 style headings (commonly used in Blogger)
      .replace(
        /<h2 style="[^"]*">/g,
        '<h2 class="text-3xl font-bold text-doorlist-navy mb-6 mt-12">'
      )
      // Convert h3 style headings
      .replace(
        /<h3 style="[^"]*">/g,
        '<h3 class="text-2xl font-bold text-doorlist-navy mb-4 mt-8">'
      );
    
    return processed;
  };

  return (
    <div 
      className="prose prose-lg prose-slate max-w-none
        prose-headings:font-bold prose-headings:text-doorlist-navy
        prose-h1:text-4xl prose-h1:mb-8 prose-h1:leading-tight
        prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12
        prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
        prose-h4:text-xl prose-h4:mb-4 prose-h4:mt-6
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-doorlist-salmon prose-a:no-underline hover:prose-a:underline
        prose-strong:text-doorlist-navy
        prose-ul:list-disc prose-ol:list-decimal
        prose-blockquote:border-l-4 prose-blockquote:border-doorlist-salmon
        prose-img:rounded-lg prose-img:shadow-lg"
      dangerouslySetInnerHTML={{ __html: processContent(content) }} 
    />
  );
};

export default BlogPostContent;