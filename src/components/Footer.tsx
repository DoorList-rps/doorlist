import { useState } from "react";
import { useSEOFooterLinks } from "@/hooks/useSEOFooterLinks";
import FooterLogo from "./footer/FooterLogo";
import FooterLinks from "./footer/FooterLinks";
import FooterSEOLinks from "./footer/FooterSEOLinks";
import FooterLegal from "./footer/FooterLegal";

const Footer = () => {
  const { data: seoLinks } = useSEOFooterLinks();
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLinkClick = (link: any) => {
    // Categories that should use filters instead of search
    const filterCategories = ['Investment Sizes'];
    
    if (!filterCategories.includes(link.category)) {
      // For most categories, we'll use the search functionality
      const searchParams = new URLSearchParams();
      searchParams.set('search', link.title);
      return link.url.includes('sponsor') 
        ? `/sponsors?${searchParams.toString()}`
        : `/investments?${searchParams.toString()}`;
    } else {
      // For other categories (like investment sizes), keep using filters
      return `${link.url}${link.filters ? `?filters=${encodeURIComponent(JSON.stringify(link.filters))}` : ''}`;
    }
  };

  const groupedLinks = seoLinks?.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, typeof seoLinks>);

  return (
    <footer className="bg-doorlist-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <FooterLogo />
          <FooterLinks />
        </div>

        <FooterSEOLinks 
          groupedLinks={groupedLinks}
          openCategories={openCategories}
          toggleCategory={toggleCategory}
          handleLinkClick={handleLinkClick}
        />

        <FooterLegal />
      </div>
    </footer>
  );
};

export default Footer;