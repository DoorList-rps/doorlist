import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorCardProps {
  sponsor: Tables<'sponsors'>;
}

const SponsorCard = ({ sponsor }: SponsorCardProps) => {
  return (
    <Link 
      to={`/sponsors/${sponsor.slug}`}
      className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col items-center">
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
      
      <p className="text-gray-600 mb-4 text-center line-clamp-3">
        {sponsor.short_description || 'No description available'}
      </p>

      {sponsor.headquarters && (
        <p className="text-sm text-gray-500 text-center">
          {sponsor.headquarters}
        </p>
      )}
    </Link>
  );
};

export default SponsorCard;