import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, Linkedin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  linkedin_url?: string;
  image_url?: string;
}

interface PastDeal {
  name: string;
  location: string;
  type: string;
  description: string;
  year: number;
  website_url?: string;
  image_url?: string;
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

  const teamMembers = ((sponsor.team_members as unknown) as TeamMember[] | null) ?? null;
  const pastDeals = ((sponsor.past_deals as unknown) as PastDeal[] | null) ?? null;

  useEffect(() => {
    const validateLinkedInUrls = async () => {
      if (!teamMembers) return;
      
      for (const member of teamMembers) {
        try {
          const { data, error } = await supabase.functions.invoke('validate-linkedin', {
            body: { name: member.name, currentUrl: member.linkedin_url }
          });
          
          if (error) {
            console.error('Error validating LinkedIn URL:', error);
          } else if (data.url !== member.linkedin_url) {
            console.log(`Updated LinkedIn URL for ${member.name}: ${data.url}`);
          }
        } catch (error) {
          console.error('Error calling validate-linkedin function:', error);
        }
      }
    };

    validateLinkedInUrls();
  }, [teamMembers]);

  const formatLinkedInUrl = (url: string | undefined): string => {
    if (!url) return '';
    
    // If it's already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's just the profile ID/handle, construct the full URL
    if (!url.includes('linkedin.com')) {
      return `https://www.linkedin.com/in/${url}`;
    }
    
    return url;
  };

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
                  <div key={index} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        {member.image_url ? (
                          <AvatarImage src={member.image_url} alt={member.name} />
                        ) : (
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-doorlist-navy">{member.name}</h4>
                          {member.linkedin_url && (
                            <a 
                              href={formatLinkedInUrl(member.linkedin_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-doorlist-salmon hover:text-doorlist-navy transition-colors"
                              aria-label={`${member.name}'s LinkedIn profile`}
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-doorlist-salmon">{member.title}</p>
                        <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                      </div>
                    </div>
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
                  <div key={index} className="space-y-4">
                    {deal.image_url && (
                      <div className="aspect-video relative rounded-lg overflow-hidden">
                        <img 
                          src={deal.image_url} 
                          alt={deal.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-doorlist-navy">{deal.name}</h4>
                        {deal.website_url && (
                          <a 
                            href={deal.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-doorlist-salmon hover:text-doorlist-navy transition-colors"
                            aria-label={`Visit ${deal.name} website`}
                          >
                            <Link2 className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Location:</span> {deal.location}</p>
                        <p><span className="font-medium">Type:</span> {deal.type}</p>
                        <p><span className="font-medium">Year:</span> {deal.year}</p>
                        <p className="mt-2">{deal.description}</p>
                      </div>
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
