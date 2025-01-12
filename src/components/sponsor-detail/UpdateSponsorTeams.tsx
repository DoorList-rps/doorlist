import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  linkedin_url?: string;
  image_url?: string;
}

interface Sponsor {
  name: string;
  team_members: TeamMember[] | null;
}

const UpdateSponsorTeams = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const updateTeamMembers = async () => {
    setIsProcessing(true);
    try {
      // Fetch all sponsors
      const { data: sponsors, error } = await supabase
        .from('sponsors')
        .select('name, team_members');

      if (error) throw error;

      // Process each sponsor's team members
      for (const sponsor of sponsors) {
        if (sponsor.team_members && Array.isArray(sponsor.team_members)) {
          console.log(`Processing team members for ${sponsor.name}`);
          
          try {
            const response = await supabase.functions.invoke('validate-sponsor-teams', {
              body: {
                sponsor_name: sponsor.name,
                team_members: sponsor.team_members
              }
            });

            if (response.error) {
              console.error(`Error processing ${sponsor.name}:`, response.error);
              toast({
                title: "Error",
                description: `Failed to update team members for ${sponsor.name}`,
                variant: "destructive",
              });
            } else {
              console.log(`Successfully updated team members for ${sponsor.name}`);
              toast({
                title: "Success",
                description: `Updated team members for ${sponsor.name}`,
              });
            }
          } catch (err) {
            console.error(`Error invoking function for ${sponsor.name}:`, err);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sponsors",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <Button 
        onClick={updateTeamMembers} 
        disabled={isProcessing}
        className="bg-doorlist-navy hover:bg-doorlist-salmon text-white"
      >
        {isProcessing ? "Processing..." : "Update All Sponsor Teams"}
      </Button>
    </div>
  );
};

export default UpdateSponsorTeams;