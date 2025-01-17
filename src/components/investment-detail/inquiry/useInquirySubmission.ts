import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useInquirySubmission = (investmentId: string, isLoggedIn: boolean, userId: string | null) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInquiry = async () => {
    console.log('Starting inquiry submission...', { isLoggedIn, userId, investmentId });
    
    if (!isLoggedIn) {
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', location.pathname);
      searchParams.set('action', 'request_details');
      searchParams.set('investment_id', investmentId);
      
      toast({
        title: "Sign in Required",
        description: "Please sign in to request investment details. We'll redirect you back here afterward.",
      });
      
      navigate(`/login?${searchParams.toString()}`);
      return;
    }

    if (!userId) {
      console.error('No user ID available');
      toast({
        title: "Error",
        description: "Unable to verify user credentials. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: existingRequest } = await supabase
        .from('investment_inquiries')
        .select('id')
        .eq('investment_id', investmentId)
        .eq('user_id', userId)
        .single();

      if (existingRequest) {
        console.log('Request already exists');
        toast({
          title: "Request Already Submitted",
          description: "You have already requested details for this investment.",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: investment } = await supabase
        .from('investments')
        .select('*')
        .eq('id', investmentId)
        .single();

      console.log('Submitting new investment inquiry:', { investmentId, userId });
      const { error: inquiryError } = await supabase
        .from('investment_inquiries')
        .insert([{ 
          investment_id: investmentId,
          user_id: userId,
          status: 'pending'
        }]);

      if (inquiryError) throw inquiryError;

      await supabase.functions.invoke('klaviyo-events', {
        body: {
          event_name: 'Investment Inquiry Created',
          customer_properties: {
            $email: userId
          },
          properties: {
            investment_name: investment?.name,
            minimum_investment: investment?.minimum_investment,
            target_return: investment?.target_return,
            property_type: investment?.property_type,
            location: `${investment?.location_city}, ${investment?.location_state}`
          }
        }
      });

      console.log('Investment inquiry submitted successfully');
      toast({
        title: "Request Submitted",
        description: "We'll connect you with the sponsor shortly.",
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Request Failed",
        description: "Unable to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleInquiry
  };
};