import { Link } from "react-router-dom";
import InvestmentDetails from "./InvestmentDetails";
import SponsorCard from "./SponsorCard";
import SponsorDetails from "./SponsorDetails";
import RelatedInvestments from "./RelatedInvestments";
import { useRelatedInvestments } from "@/hooks/useRelatedInvestments";
import type { Tables } from "@/integrations/supabase/types";
import InvestmentAttachments from "./InvestmentAttachments";

interface InvestmentContentProps {
  investment: Tables<'investments'> & {
    sponsors: Pick<Tables<'sponsors'>, 
      'name' | 
      'logo_url' | 
      'year_founded' | 
      'assets_under_management' | 
      'deal_volume' | 
      'number_of_deals' | 
      'advertised_returns' | 
      'holding_period' |
      'slug'
    > | null;
  };
}

const InvestmentContent = ({ investment }: InvestmentContentProps) => {
  const { data: relatedInvestments } = useRelatedInvestments(
    investment.sponsor_name,
    investment.id
  );

  return (
    <>
      {investment.sponsor_name && (
        <div className="mt-12 mb-8">
          <Link to={`/sponsors/${investment.sponsors?.slug || ''}`}>
            <SponsorCard 
              sponsor={
                investment.sponsors || 
                { name: investment.sponsor_name, logo_url: null }
              } 
            />
          </Link>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        <InvestmentDetails investment={investment} />
        {investment.sponsor_name && (
          <div className="space-y-8">
            <SponsorDetails sponsor={investment.sponsors} />
          </div>
        )}
      </div>

      <InvestmentAttachments investment={investment} />

      {investment.sponsor_name && (
        <RelatedInvestments 
          investments={relatedInvestments || []}
          sponsorName={investment.sponsor_name}
        />
      )}
    </>
  );
};

export default InvestmentContent;
