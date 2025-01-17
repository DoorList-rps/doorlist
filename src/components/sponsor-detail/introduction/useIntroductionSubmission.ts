import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const useIntroductionSubmission = (
  sponsor: Tables<'sponsors'>,
  isLoggedIn: boolean,
  userId: string | null
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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
      const { error: introError } = await supabase
        .from('sponsor_introductions')
        .insert([{ 
          sponsor_id: sponsor.id,
          user_id: userId,
          status: 'pending'
        }]);

      if (introError) throw introError;

      await supabase.functions.invoke('klaviyo-events', {
        body: {
          event_name: 'Sponsor Introduction Requested',
          customer_properties: {
            $email: userId
          },
          properties: {
            sponsor_name: sponsor.name,
            sponsor_id: sponsor.id,
            minimum_investment: sponsor.minimum_investment,
            advertised_returns: sponsor.advertised_returns
          }
        }
      });

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

  return {
    isSubmitting,
    handleContactClick
  };
};