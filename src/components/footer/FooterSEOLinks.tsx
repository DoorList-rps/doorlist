import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FooterSEOLinksProps {
  groupedLinks: Record<string, any[]>;
  openCategories: string[];
  toggleCategory: (category: string) => void;
  handleLinkClick: (link: any) => string;
}

const FooterSEOLinks = ({ groupedLinks, openCategories, toggleCategory, handleLinkClick }: FooterSEOLinksProps) => {
  return (
    <>
      {groupedLinks && Object.entries(groupedLinks)
        .filter(([category]) => category !== 'Resources') // Filter out the Resources category
        .map(([category, links]) => (
          <div key={category} className="mt-8 border-t border-gray-800 pt-6">
            <Collapsible
              open={openCategories.includes(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                <h4 className="font-semibold text-lg">{category}</h4>
                {openCategories.includes(category) ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {links?.map((link) => (
                    <Link
                      key={link.id}
                      to={handleLinkClick(link)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
    </>
  );
};

export default FooterSEOLinks;