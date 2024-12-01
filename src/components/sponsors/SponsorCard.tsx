import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import { Building2, Target, BarChart3 } from "lucide-react";

interface SponsorCardProps {
  sponsor: Tables<'sponsors'>;
}

const SponsorCard = ({ sponsor }: SponsorCardProps) => {
  return (
    <Link 
      to={`/sponsors/${sponsor.slug}`}
      className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center mb-4">
          {sponsor.logo_url && (
            <img
              src={sponsor.logo_url}
              alt={`${sponsor.name} logo`}
              className="w-32 h-32 object-contain mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          )}
          <h3 className="text-xl font-semibold text-center mb-2">
            {sponsor.name}
          </h3>
        </div>
        
        <div className="flex-grow">
          <p className="text-gray-600 mb-4 text-center line-clamp-3">
            {sponsor.short_description || 'No description available'}
          </p>

          <div className="space-y-2 text-sm text-gray-600">
            {sponsor.headquarters && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{sponsor.headquarters}</span>
              </div>
            )}
            
            {sponsor.number_of_deals !== null && (
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>{sponsor.number_of_deals} Completed Deals</span>
              </div>
            )}
            
            {sponsor.advertised_returns && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Target Returns: {sponsor.advertised_returns}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SponsorCard;