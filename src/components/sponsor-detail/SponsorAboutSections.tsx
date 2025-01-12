import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";

interface SponsorAboutSectionsProps {
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

const SponsorAboutSections = ({ sponsor }: SponsorAboutSectionsProps) => {
  const sections = [
    { title: "Track Record", content: sponsor.track_record },
    { title: "Investment Strategy", content: sponsor.investment_strategy },
    { title: "Team Highlights", content: sponsor.team_highlights },
    { title: "Notable Deals", content: sponsor.notable_deals },
    { title: "Market Focus", content: sponsor.market_focus },
    { title: "Investment Philosophy", content: sponsor.investment_philosophy }
  ].filter(section => section.content);

  return (
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
  );
};

export default SponsorAboutSections;