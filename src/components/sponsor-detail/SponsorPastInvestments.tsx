import { Card, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { usePastInvestments } from "@/hooks/usePastInvestments";

interface SponsorPastInvestmentsProps {
  sponsorName: string;
}

const SponsorPastInvestments = ({ sponsorName }: SponsorPastInvestmentsProps) => {
  const { data: pastInvestments } = usePastInvestments(sponsorName);

  if (!pastInvestments || pastInvestments.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-doorlist-navy mb-4">Past Investments</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {pastInvestments.map((investment) => (
            <div key={investment.id} className="space-y-4">
              {investment.hero_image_url && (
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={investment.hero_image_url} 
                    alt={investment.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-doorlist-navy">{investment.name}</h4>
                  {investment.investment_url && (
                    <a 
                      href={investment.investment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-doorlist-salmon hover:text-doorlist-navy transition-colors"
                      aria-label={`Visit ${investment.name} website`}
                    >
                      <Link2 className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {investment.location_city && investment.location_state && (
                    <p><span className="font-medium">Location:</span> {`${investment.location_city}, ${investment.location_state}`}</p>
                  )}
                  {investment.property_type && (
                    <p><span className="font-medium">Type:</span> {investment.property_type}</p>
                  )}
                  <p className="mt-2">{investment.short_description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorPastInvestments;