import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
    return null;
  }

  console.log('Rendering investments:', investments);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-doorlist-navy mb-6">Investment Opportunities from {sponsorName}</h2>
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