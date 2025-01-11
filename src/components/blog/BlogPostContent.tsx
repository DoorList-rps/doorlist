import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface BlogPostContentProps {
  content: string;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ content }) => {
  // Process content to ensure proper heading tags and add internal links
  const processContent = async (htmlContent: string) => {
    let processed = htmlContent
      // Convert h2 style headings
      .replace(
        /<h2 style="[^"]*">/g,
        '<h2 class="text-3xl font-bold text-doorlist-navy mb-6 mt-12">'
      )
      // Convert h3 style headings
      .replace(
        /<h3 style="[^"]*">/g,
        '<h3 class="text-2xl font-bold text-doorlist-navy mb-4 mt-8">'
      );

    // Add internal links for key terms
    const internalLinks = {
      // Investment-related terms
      'real estate investment': '/investments',
      'investment opportunities': '/investments',
      'property investments': '/investments',
      'real estate investing': '/investments',
      'investment property': '/investments',
      'commercial real estate': '/investments',
      'multifamily investments': '/investments',
      'real estate deals': '/investments',
      'investment portfolio': '/investments',
      'real estate portfolio': '/investments',
      'passive real estate': '/investments',
      
      // Sponsor-related terms
      'real estate sponsors': '/sponsors',
      'investment sponsors': '/sponsors',
      'property sponsors': '/sponsors',
      'sponsor track record': '/sponsors',
      'experienced sponsors': '/sponsors',
      'institutional sponsors': '/sponsors',
      'real estate operators': '/sponsors',
      
      // Education-related terms
      'accredited investors': '/education/accredited-investor-guide',
      'qualified purchaser': '/education/qualified-purchaser-guide',
      'passive income': '/calculator',
      'investment calculator': '/calculator',
      'return calculator': '/calculator',
      'learn more about investing': '/education',
      'educational resources': '/education',
      'investment guide': '/education',
      'real estate education': '/education',
      'investment basics': '/education',
      'investor guide': '/education',
      '1031 exchange': '/education/1031-exchange-guide',
      'real estate syndication': '/education/real-estate-syndication-guide',
      'dst investments': '/education/dst-investment-guide',
      'qualified opportunity zones': '/education/opportunity-zones-guide',
      
      // Other important pages
      'contact us': '/contact',
      'about DoorList': '/about',
      'submit investment': '/submit-investment',
      'investment criteria': '/about#investment-criteria',
    };

    // Replace key terms with internal links
    Object.entries(internalLinks).forEach(([term, url]) => {
      // Case-insensitive regex that excludes existing links and HTML tags
      const regex = new RegExp(`\\b${term}\\b(?![^<]*>|[^<>]*<\\/a>)`, 'gi');
      processed = processed.replace(regex, `<a href="${url}" class="text-doorlist-salmon hover:underline">${term}</a>`);
    });

    // Add dynamic sponsor links if they exist in the content
    // This regex looks for company names followed by common sponsor identifiers
    const sponsorRegex = /([A-Z][A-Za-z0-9\s&.-]+)\s+(Investments|Capital|Properties|Real Estate|Group|Partners)(?!\s*<\/a>)/g;
    const sponsorMatches = [...htmlContent.matchAll(sponsorRegex)];
    
    for (const match of sponsorMatches) {
      const companyName = match[0];
      const sponsorSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Check if sponsor exists in database
      const { data: sponsor } = await supabase
        .from('sponsors')
        .select('slug')
        .eq('slug', sponsorSlug)
        .maybeSingle();
      
      if (sponsor) {
        const link = `<a href="/sponsors/${sponsorSlug}" class="text-doorlist-salmon hover:underline">${companyName}</a>`;
        processed = processed.replace(new RegExp(companyName + '(?![^<]*>|[^<>]*</a>)', 'g'), link);
      }
    }

    // Add dynamic investment property links
    // This regex looks for property names followed by common property types
    const propertyRegex = /([A-Z][A-Za-z0-9\s&.-]+)\s+(Apartments|Plaza|Tower|Center|Complex|Building|Development)(?!\s*<\/a>)/g;
    const propertyMatches = [...htmlContent.matchAll(propertyRegex)];
    
    for (const match of propertyMatches) {
      const propertyName = match[0];
      const propertySlug = propertyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Check if investment exists in database
      const { data: investment } = await supabase
        .from('investments')
        .select('slug')
        .eq('slug', propertySlug)
        .maybeSingle();
      
      if (investment) {
        const link = `<a href="/investments/${propertySlug}" class="text-doorlist-salmon hover:underline">${propertyName}</a>`;
        processed = processed.replace(new RegExp(propertyName + '(?![^<]*>|[^<>]*</a>)', 'g'), link);
      }
    }

    return processed;
  };

  const [processedContent, setProcessedContent] = React.useState(content);

  React.useEffect(() => {
    processContent(content).then(setProcessedContent);
  }, [content]);

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
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
};

export default BlogPostContent;