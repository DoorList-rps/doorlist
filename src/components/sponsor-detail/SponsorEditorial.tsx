import type { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const teamMembers = ((sponsor.team_members as unknown) as TeamMember[] | null) ?? null;

  useEffect(() => {
    const validateTeamMembers = async () => {
      if (!teamMembers || teamMembers.length === 0) return;

      try {
        console.log('Validating team members for sponsor:', sponsor.name);
        const { data, error } = await supabase.functions.invoke('validate-sponsor-teams', {
          body: {
            sponsor_name: sponsor.name,
            team_members: teamMembers
          }
        });

        if (error) {
          console.error('Error validating team members:', error);
          toast({
            title: "Error updating team members",
            description: "There was an error updating the team members. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        if (data?.success) {
          console.log('Successfully validated team members:', data.team_members);
          toast({
            title: "Team members updated",
            description: "Successfully updated team member information.",
          });
        }
      } catch (error) {
        console.error('Error in validateTeamMembers:', error);
      }
    };

    validateTeamMembers();
  }, [sponsor.name, teamMembers]);

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