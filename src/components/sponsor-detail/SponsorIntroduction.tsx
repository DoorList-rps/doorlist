import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorIntroductionProps {
  sponsor: Tables<'sponsors'>;
  isLoggedIn: boolean;
  userId: string | null;
}

const SponsorIntroduction = ({ 
  sponsor, 
  isLoggedIn, 
  userId 
}: SponsorIntroductionProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactClick = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request an introduction.",
      });
      navigate("/login", { 
        state: { 
          returnTo: `/sponsors/${sponsor.slug}`,
          action: 'request_introduction',
          sponsor_id: sponsor.id
        } 
      });
      return;
    }

    if (!userId || !sponsor.id) return;

    setIsSubmitting(true);

    try {
      console.log('Submitting sponsor introduction:', { sponsorId: sponsor.id, userId });
      const { error } = await supabase
        .from('sponsor_introductions')
        .insert([
          { 
            sponsor_id: sponsor.id, 
            user_id: userId,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Introduction Requested",
        description: "We'll connect you with " + sponsor.name + " shortly.",
      });
    } catch (error) {
      console.error('Error requesting introduction:', error);
      toast({
        title: "Error",
        description: "Failed to request introduction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleContactClick}
        size="lg"
        className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : `I'd Like a Personal Introduction to ${sponsor.name}`}
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