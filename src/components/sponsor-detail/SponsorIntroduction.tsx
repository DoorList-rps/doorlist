import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactClick = async () => {
    console.log('Starting sponsor introduction request...', { isLoggedIn, userId, sponsorId: sponsor.id });

    if (!isLoggedIn) {
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', location.pathname);
      searchParams.set('action', 'request_introduction');
      searchParams.set('sponsor_id', sponsor.id);
      
      toast({
        title: "Sign in Required",
        description: "Please sign in to request an introduction to " + sponsor.name,
      });
      
      navigate(`/login?${searchParams.toString()}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from('sponsor_introductions')
        .select('id')
        .eq('sponsor_id', sponsor.id)
        .eq('user_id', userId)
        .single();

      if (existingRequest) {
        console.log('Introduction request already exists');
        toast({
          title: "Request Already Submitted",
          description: `You have already requested an introduction to ${sponsor.name}.`,
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting new sponsor introduction:', { sponsorId: sponsor.id, userId });
      const { error } = await supabase
        .from('sponsor_introductions')
        .insert([
          { 
            sponsor_id: sponsor.id,
            user_id: userId,
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Sponsor introduction submitted successfully');
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
