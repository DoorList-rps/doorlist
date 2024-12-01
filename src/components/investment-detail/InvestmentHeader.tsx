import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import InvestmentInquiryButton from "./InvestmentInquiryButton";

interface InvestmentHeaderProps {
  investment: Tables<'investments'> & {
    sponsors: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> | null;
  };
  onSaveInvestment: () => void;
  isSaved: boolean;
  isLoggedIn: boolean;
  userId: string | null;
}

const InvestmentHeader = ({ 
  investment, 
  onSaveInvestment, 
  isSaved, 
  isLoggedIn,
  userId 
}: InvestmentHeaderProps) => {
  return (
    <>
      <Link to="/investments" className="inline-block mb-6">
        <Button variant="ghost" className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Investments
        </Button>
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-doorlist-navy">{investment.name}</h1>
            {isLoggedIn && (
              <Button
                onClick={onSaveInvestment}
                variant="ghost"
                size="icon"
                className={`ml-4 ${isSaved ? 'text-doorlist-salmon hover:text-doorlist-salmon/90' : 'text-gray-400 hover:text-doorlist-salmon'}`}
              >
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>
          <p className="text-gray-600 mb-6">{investment.description || investment.short_description}</p>
          <div className="space-y-4 mb-6">
            <InvestmentInquiryButton
              investmentId={investment.id}
              isLoggedIn={isLoggedIn}
              userId={userId}
            />
            {investment.investment_url && (
              <Button
                onClick={() => window.open(investment.investment_url, '_blank')}
                className="w-full bg-doorlist-salmon/20 hover:bg-doorlist-salmon/30 text-doorlist-salmon"
              >
                View Investment Website
              </Button>
            )}
          </div>
        </div>
        <div>
          <img
            src={investment.hero_image_url || '/placeholder.svg'}
            alt={investment.name}
            className="w-full h-[400px] object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
      </div>
    </>
  );
};

export default InvestmentHeader;