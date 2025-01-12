import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";

interface SponsorEditorialProps {
  sponsor: Pick<Tables<'sponsors'>, 
    'name' |
    'track_record' | 
    'investment_strategy' | 
    'team_highlights' | 
    'notable_deals' | 
    'market_focus' | 
    'investment_philosophy'
  >;
}

const SponsorEditorial = ({ sponsor }: SponsorEditorialProps) => {
  const sections = [
    { title: "Track Record", content: sponsor.track_record },
    { title: "Investment Strategy", content: sponsor.investment_strategy },
    { title: "Team Highlights", content: sponsor.team_highlights },
    { title: "Notable Deals", content: sponsor.notable_deals },
    { title: "Market Focus", content: sponsor.market_focus },
    { title: "Investment Philosophy", content: sponsor.investment_philosophy }
  ].filter(section => section.content);

  if (sections.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-doorlist-navy mb-6">About {sponsor.name}</h2>
      <div className="grid gap-6">
        {sections.map(({ title, content }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-doorlist-navy mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SponsorEditorial;