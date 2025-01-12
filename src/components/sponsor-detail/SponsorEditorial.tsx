import { useState, useEffect } from "react";
import type { Tables } from "@/integrations/supabase/types";
import SponsorAboutSections from "./SponsorAboutSections";
import SponsorTeam from "./SponsorTeam";
import SponsorPastInvestments from "./SponsorPastInvestments";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    'team_members' |
    'year_founded' |
    'headquarters' |
    'assets_under_management' |
    'deal_volume' |
    'number_of_deals' |
    'investment_types' |
    'property_types'
  >;
}

const SponsorEditorial = ({ sponsor }: SponsorEditorialProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState(sponsor);
  const { toast } = useToast();
  const teamMembers = ((currentSponsor.team_members as unknown) as TeamMember[] | null) ?? null;

  useEffect(() => {
    setCurrentSponsor(sponsor);
  }, [sponsor]);

  // Check if user is admin
  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      
      if (session?.user?.email) {
        console.log("User email:", session.user.email);
        
        // Add admin emails
        const adminEmails = ['ryan.sudeck@gmail.com', 'ryan@doorlist.co', 'test@doorlist.co'];
        setIsAdmin(adminEmails.includes(session.user.email));
        console.log("Is admin?", adminEmails.includes(session.user.email));
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const refreshContent = async () => {
    try {
      setIsRefreshing(true);
      console.log("Starting content refresh for sponsor:", currentSponsor.name);

      const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-sponsor-content', {
        body: {
          sponsorName: currentSponsor.name,
          sponsorData: currentSponsor,
        },
      });

      if (functionError) {
        console.error("Edge function error:", functionError);
        throw functionError;
      }

      console.log("Edge function response:", functionData);

      // Fetch the updated sponsor data
      const { data: updatedSponsor, error: fetchError } = await supabase
        .from('sponsors')
        .select('*')
        .eq('name', currentSponsor.name)
        .single();

      if (fetchError) {
        console.error("Error fetching updated sponsor:", fetchError);
        throw fetchError;
      }

      console.log("Updated sponsor data:", updatedSponsor);

      // Update the local state with the new sponsor data
      setCurrentSponsor(updatedSponsor);

      toast({
        title: "Content refreshed",
        description: "The sponsor's editorial content has been updated.",
      });
    } catch (error) {
      console.error('Error refreshing content:', error);
      toast({
        title: "Error",
        description: "Failed to refresh the content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!currentSponsor) {
    console.log("No sponsor data available");
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-doorlist-navy">About {currentSponsor.name}</h2>
        {isAdmin && (
          <Button
            variant="outline"
            onClick={refreshContent}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Content
          </Button>
        )}
      </div>
      <div className="grid gap-6">
        <SponsorAboutSections sponsor={currentSponsor} />
        {teamMembers && <SponsorTeam teamMembers={teamMembers} />}
        <SponsorPastInvestments sponsorName={currentSponsor.name} />
      </div>
    </div>
  );
};

export default SponsorEditorial;