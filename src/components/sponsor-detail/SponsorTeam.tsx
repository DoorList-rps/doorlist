import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  linkedin_url?: string;
  image_url?: string;
}

interface SponsorTeamProps {
  teamMembers: TeamMember[] | null;
}

const SponsorTeam = ({ teamMembers }: SponsorTeamProps) => {
  if (!teamMembers || teamMembers.length === 0) return null;

  const getDefaultAvatarUrl = (name: string): string => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  const formatLinkedInUrl = (url: string | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (!url.includes('linkedin.com')) {
      return `https://www.linkedin.com/in/${url}`;
    }
    return url;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-doorlist-navy mb-4">Leadership Team</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  {member.image_url ? (
                    <AvatarImage 
                      src={member.image_url} 
                      alt={member.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getDefaultAvatarUrl(member.name);
                      }}
                    />
                  ) : (
                    <AvatarImage 
                      src={getDefaultAvatarUrl(member.name)}
                      alt={member.name}
                    />
                  )}
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
  );
};

export default SponsorTeam;