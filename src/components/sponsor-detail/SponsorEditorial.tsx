import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
}

interface PastDeal {
  name: string;
  location: string;
  type: string;
  description: string;
  year: number;
}

interface SponsorEditorialProps {
  sponsor: Pick<Tables<'sponsors'>, 
    'name' |
    'track_record' | 
    'investment_strategy' | 
    'team_highlights' | 
    'notable_deals' | 
    'market_focus' | 
    'investment_philosophy' |
    'team_members' |
    'past_deals'
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

  const teamMembers = sponsor.team_members as TeamMember[] | null;
  const pastDeals = sponsor.past_deals as PastDeal[] | null;

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

        {teamMembers && teamMembers.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-doorlist-navy mb-4">Leadership Team</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {teamMembers.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-doorlist-navy">{member.name}</h4>
                    <p className="text-sm text-doorlist-salmon">{member.title}</p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {pastDeals && pastDeals.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-doorlist-navy mb-4">Past Deals</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {pastDeals.map((deal, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-doorlist-navy">{deal.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Location:</span> {deal.location}</p>
                      <p><span className="font-medium">Type:</span> {deal.type}</p>
                      <p><span className="font-medium">Year:</span> {deal.year}</p>
                      <p className="mt-2">{deal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SponsorEditorial;