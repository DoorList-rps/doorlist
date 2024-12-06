import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorIntroductionProps {
  sponsor: Tables<'sponsors'>;
  isLoggedIn: boolean;
  userId: string | null;
  introductionStatus: string | null;
}

const SponsorIntroduction = ({ 
  sponsor, 
  isLoggedIn, 
  userId, 
  introductionStatus 
}: SponsorIntroductionProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContactClick = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request an introduction.",
      });
      navigate("/login");
      return;
    }

    if (!userId || !sponsor.id) return;

    const { error } = await supabase
      .from('sponsor_introductions')
      .insert([
        { user_id: userId, sponsor_id: sponsor.id }
      ]);

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already Requested",
          description: "You have already requested an introduction to this sponsor.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to request introduction. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Introduction Requested",
      description: "We'll connect you with " + sponsor.name + " shortly.",
    });
  };

  const getButtonText = () => {
    if (introductionStatus === 'pending') {
      return `Connecting you with ${sponsor.name}...`;
    }
    return `I'd Like a Personal Introduction to ${sponsor.name}`;
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleContactClick}
        size="lg"
        className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90 disabled:bg-gray-300"
        disabled={introductionStatus === 'pending'}
      >
        {getButtonText()}
      </Button>

      {sponsor.website_url && (
        <Button
          onClick={() => window.open(sponsor.website_url, '_blank')}
          size="lg"
          className="w-full bg-doorlist-salmon/20 hover:bg-doorlist-salmon/30 text-doorlist-salmon"
        >
          View Sponsor Website
        </Button>
      )}
    </div>
  );
};

export default SponsorIntroduction;