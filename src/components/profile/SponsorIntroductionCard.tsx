import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import StatusTracker from "./StatusTracker";

interface SponsorIntroduction extends Tables<'sponsor_introductions'> {
  sponsors: Tables<'sponsors'>;
}

interface SponsorIntroductionCardProps {
  introduction: SponsorIntroduction;
}

const SponsorIntroductionCard = ({ introduction }: SponsorIntroductionCardProps) => {
  return (
    <div className="space-y-4 border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center space-x-4">
        {introduction.sponsors?.logo_url && (
          <img
            src={introduction.sponsors.logo_url}
            alt={introduction.sponsors.name}
            className="w-12 h-12 object-contain"
          />
        )}
        <div className="flex-grow">
          <Link 
            to={`/sponsors/${introduction.sponsors?.slug}`}
            className="font-medium hover:text-doorlist-salmon"
          >
            {introduction.sponsors?.name}
          </Link>
          <p className="text-sm text-gray-500">
            Introduction requested on {new Date(introduction.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <StatusTracker status={introduction.status || 'requested'} />
    </div>
  );
};

export default SponsorIntroductionCard;