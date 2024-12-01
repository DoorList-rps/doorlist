import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import StatusTracker from "./StatusTracker";

interface InvestmentInquiry extends Tables<'investment_inquiries'> {
  investments: Tables<'investments'>;
}

interface InvestmentInquiryCardProps {
  inquiry: InvestmentInquiry;
}

const InvestmentInquiryCard = ({ inquiry }: InvestmentInquiryCardProps) => {
  return (
    <div className="space-y-4 border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center space-x-4">
        {inquiry.investments?.hero_image_url && (
          <img
            src={inquiry.investments.hero_image_url}
            alt={inquiry.investments.name}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-grow">
          <Link 
            to={`/investments/${inquiry.investments?.slug}`}
            className="font-medium hover:text-doorlist-salmon"
          >
            {inquiry.investments?.name}
          </Link>
          {inquiry.investments?.minimum_investment && (
            <p className="text-sm text-gray-500">
              Min. Investment: ${inquiry.investments.minimum_investment.toLocaleString()}
            </p>
          )}
          {(inquiry.investments?.location_city || inquiry.investments?.location_state) && (
            <p className="text-sm text-gray-500">
              {[inquiry.investments.location_city, inquiry.investments.location_state]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Requested on {new Date(inquiry.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <StatusTracker status={inquiry.status || 'requested'} />
    </div>
  );
};

export default InvestmentInquiryCard;