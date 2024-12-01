import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorStatsProps {
  sponsor: Tables<'sponsors'>;
}

const SponsorStats = ({ sponsor }: SponsorStatsProps) => (
  <div className="mt-12 grid md:grid-cols-2 gap-8">
    <div>
      <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Track Record</h2>
      <Card>
        <CardContent className="p-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-doorlist-navy">{sponsor.number_of_deals || '0'}</p>
            <p className="text-gray-500">Total Deals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-doorlist-navy">{sponsor.deal_volume || 'N/A'}</p>
            <p className="text-gray-500">Deal Volume</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-doorlist-navy">{sponsor.advertised_returns || 'N/A'}</p>
            <p className="text-gray-500">Target Returns</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-doorlist-navy">{sponsor.minimum_investment || 'N/A'}</p>
            <p className="text-gray-500">Minimum Investment</p>
          </div>
        </CardContent>
      </Card>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Additional Information</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Investment Types</p>
              <p className="text-gray-600">
                {sponsor.investment_types ? sponsor.investment_types.join(', ') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="font-semibold">Holding Period</p>
              <p className="text-gray-600">{sponsor.holding_period || 'N/A'}</p>
            </div>
            {sponsor.linkedin_url && (
              <div>
                <p className="font-semibold">LinkedIn</p>
                <a 
                  href={sponsor.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-doorlist-navy hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default SponsorStats;