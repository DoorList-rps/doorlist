import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorCardProps {
  sponsor: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> | { name: string; logo_url: string | null };
}

const SponsorCard = ({ sponsor }: SponsorCardProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Sponsor</h2>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={sponsor.logo_url || '/placeholder.svg'}
              alt={sponsor.name}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <div>
              <h3 className="text-xl font-semibold">{sponsor.name}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorCard;