import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorDetailsProps {
  sponsor: Pick<Tables<'sponsors'>, 
    'name' | 
    'logo_url' | 
    'year_founded' | 
    'assets_under_management' | 
    'deal_volume' | 
    'number_of_deals' | 
    'advertised_returns' | 
    'holding_period'
  > | null;
}

const formatCurrency = (value: string | null) => {
  if (!value) return 'N/A';
  
  // Remove any existing formatting and convert to number
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  
  if (isNaN(numericValue)) return value;
  
  // Format based on size
  if (numericValue >= 1e9) {
    return `$${(numericValue / 1e9).toFixed(1)}B`;
  } else if (numericValue >= 1e6) {
    return `$${(numericValue / 1e6).toFixed(1)}M`;
  } else if (numericValue >= 1e3) {
    return `$${(numericValue / 1e3).toFixed(1)}K`;
  }
  
  return `$${numericValue.toLocaleString()}`;
};

const SponsorDetails = ({ sponsor }: SponsorDetailsProps) => {
  if (!sponsor) return null;

  const details = [
    { label: "Experience", value: sponsor.year_founded ? `Since ${sponsor.year_founded}` : 'N/A' },
    { label: "Assets Under Management", value: formatCurrency(sponsor.assets_under_management) },
    { label: "Deal Volume", value: formatCurrency(sponsor.deal_volume) },
    { label: "Number of Deals", value: sponsor.number_of_deals?.toString() || 'N/A' },
    { label: "Target Returns", value: sponsor.advertised_returns || 'N/A' },
    { label: "Typical Holding Period", value: sponsor.holding_period || 'N/A' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Sponsor Details</h2>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {details.map((detail, index) => (
              <div key={index}>
                <p className="text-gray-500">{detail.label}</p>
                <p className="text-xl font-semibold">{detail.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorDetails;