import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface InvestmentHeaderProps {
  investment: Tables<'investments'> & {
    sponsors: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> | null;
  };
  onSaveInvestment: () => void;
  isSaved: boolean;
  isLoggedIn: boolean;
}

const InvestmentHeader = ({ investment, onSaveInvestment, isSaved, isLoggedIn }: InvestmentHeaderProps) => {
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
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-doorlist-navy mb-4">{investment.name}</h1>
            {isLoggedIn && (
              <Button
                onClick={onSaveInvestment}
                variant={isSaved ? "secondary" : "default"}
                className="ml-4"
              >
                {isSaved ? "Unsave Investment" : "Save Investment"}
              </Button>
            )}
          </div>
          <p className="text-gray-600 mb-6">{investment.description || investment.short_description}</p>
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