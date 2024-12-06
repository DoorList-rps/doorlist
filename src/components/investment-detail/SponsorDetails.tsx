import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";
import { formatCurrency } from "@/utils/formatCurrency";

interface SponsorDetailsProps {
  sponsor: Pick<Tables<'sponsors'>, 
    'name' | 
    'logo_url' | 
    'year_founded' | 
    'assets_under_management' | 
    'deal_volume' | 
    'advertised_returns' | 
    'holding_period'
  > | null;
}

const SponsorDetails = ({ sponsor }: SponsorDetailsProps) => {
  if (!sponsor) return null;

  const details = [
    { label: "Experience", value: sponsor.year_founded ? `Since ${sponsor.year_founded}` : 'N/A' },
    { label: "Assets Under Management", value: formatCurrency(sponsor.assets_under_management) },
    { label: "Deal Volume", value: formatCurrency(sponsor.deal_volume) },
    { label: "Target Returns", value: sponsor.advertised_returns || 'N/A' },
    { label: "Typical Holding Period", value: sponsor.holding_period || 'N/A' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Sponsor Details</h2>
      <Card>
        <CardContent className="p-6">
          {details.map(({ label, value }) => value && (
            <div key={label} className="flex justify-between py-2 border-b last:border-0">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorDetails;