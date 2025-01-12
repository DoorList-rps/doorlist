import type { Tables } from "@/integrations/supabase/types";
import SponsorAboutSections from "./SponsorAboutSections";
import SponsorTeam from "./SponsorTeam";
import SponsorPastInvestments from "./SponsorPastInvestments";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  linkedin_url?: string;
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
    'team_members'
  >;
}

const SponsorEditorial = ({ sponsor }: SponsorEditorialProps) => {
  const teamMembers = ((sponsor.team_members as unknown) as TeamMember[] | null) ?? null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-doorlist-navy mb-6">About {sponsor.name}</h2>
      <div className="grid gap-6">
        <SponsorAboutSections sponsor={sponsor} />
        {teamMembers && <SponsorTeam teamMembers={teamMembers} />}
        <SponsorPastInvestments sponsorName={sponsor.name} />
      </div>
    </div>
  );
};

export default SponsorEditorial;