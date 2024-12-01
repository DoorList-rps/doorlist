import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface InvestmentCardProps {
  investment: Tables<'investments'> & { 
    sponsors: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> 
  };
}

const InvestmentCard = ({ investment }: InvestmentCardProps) => {
  return (
    <Link to={`/investments/${investment.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
        <img
          src={investment.hero_image_url || '/placeholder.svg'}
          alt={investment.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <CardHeader>
          <CardTitle 
            className={`text-xl ${investment.name.length < 35 ? 'mb-2' : 'mb-0'}`}
          >
            {investment.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <div className="flex-grow">
            <p className="text-gray-600 mb-6">{investment.short_description || investment.description}</p>
          </div>
          <div className="mt-auto space-y-2">
            {investment.minimum_investment && (
              <div className="flex justify-between">
                <span className="text-gray-500">Minimum</span>
                <span className="font-medium">${investment.minimum_investment.toLocaleString()}</span>
              </div>
            )}
            {investment.target_return && (
              <div className="flex justify-between">
                <span className="text-gray-500">Target Return</span>
                <span className="font-medium">{investment.target_return}</span>
              </div>
            )}
            {(investment.location_city || investment.location_state) && (
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-medium">
                  {[investment.location_city, investment.location_state]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default InvestmentCard;