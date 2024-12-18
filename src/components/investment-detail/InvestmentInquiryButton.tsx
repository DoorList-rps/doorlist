import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvestmentInquiryButtonProps {
  investmentId: string;
  isLoggedIn: boolean;
  userId: string | null;
}

const InvestmentInquiryButton = ({ investmentId, isLoggedIn, userId }: InvestmentInquiryButtonProps) => {
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
      // Check if request already exists
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

      console.log('Submitting new investment inquiry:', { investmentId, userId });
      const { error } = await supabase
        .from('investment_inquiries')
        .insert([
          { 
            investment_id: investmentId,
            user_id: userId,
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

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

  return (
    <Button
      onClick={handleInquiry}
      disabled={isSubmitting}
      className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
    >
      {isSubmitting ? "Submitting..." : "Request Investment Details"}
    </Button>
  );
};

export default InvestmentInquiryButton;