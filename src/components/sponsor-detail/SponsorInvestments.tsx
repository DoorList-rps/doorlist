
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorInvestmentsProps {
  investments: (Tables<'investments'> & {
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
  })[];
  sponsorName: string;
}

const SponsorInvestments = ({ investments, sponsorName }: SponsorInvestmentsProps) => {
  if (!investments || investments.length === 0) {
    console.log('No investments found for sponsor:', sponsorName);
    return (
      <div className="mt-12 bg-gray-50 border border-gray-100 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-doorlist-navy mb-2">No Current Investments</h2>
        <p className="text-gray-600 mb-4">
          {sponsorName} doesn't have any active investment opportunities at this time.
        </p>
        <Link to="/submit-investment">
          <Button className="bg-doorlist-salmon hover:bg-doorlist-salmon/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Investment
          </Button>
        </Link>
      </div>
    );
  }

  console.log('Rendering investments:', investments);

  return (
    <div className="mt-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-doorlist-navy">Investment Opportunities from {sponsorName}</h2>
        <Link to="/submit-investment" className="mt-4 md:mt-0">
          <Button className="bg-doorlist-salmon hover:bg-doorlist-salmon/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Investment
          </Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {investments.map((inv) => (
          <Link key={inv.id} to={`/investments/${inv.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={inv.hero_image_url || '/placeholder.svg'}
                  alt={inv.name}
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{inv.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{inv.short_description}</p>
                {inv.minimum_investment && (
                  <p className="mt-2 text-sm text-gray-500">
                    Min. Investment: ${inv.minimum_investment.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SponsorInvestments;
