import React from 'react';

interface BlogPostContentProps {
  content: string;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ content }) => {
  // Clean up the content by preserving essential styles while removing problematic ones
  const cleanContent = content
    .replace(/style="[^"]*background-color:[^"]*"/g, '') // Remove background colors
    .replace(/style="[^"]*font-family:[^"]*"/g, '') // Remove font families
    .replace(/style="[^"]*white-space-collapse:[^"]*"/g, '') // Remove white space collapse
    .replace(/style="[^"]*cursor:[^"]*"/g, '') // Remove cursor styles
    .replace(/style="[^"]*counter-reset:[^"]*"/g, '') // Remove counter reset
    .replace(/style=""/g, '') // Remove empty style attributes
    .replace(/class=""/g, ''); // Remove empty class attributes

  return (
    <div 
      className="prose prose-lg prose-slate max-w-none
        prose-headings:font-bold prose-headings:text-doorlist-navy
        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-doorlist-salmon prose-a:no-underline hover:prose-a:underline
        prose-strong:text-doorlist-navy
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:text-gray-700 prose-li:leading-relaxed
        prose-blockquote:border-l-4 prose-blockquote:border-doorlist-salmon prose-blockquote:bg-gray-50 prose-blockquote:px-6 prose-blockquote:py-4
        prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
        [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
      dangerouslySetInnerHTML={{ __html: cleanContent }} 
    />
  );
};

export default BlogPostContent;