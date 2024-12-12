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
    if (!isLoggedIn) {
      const returnPath = location.pathname;
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', returnPath);
      searchParams.set('action', 'request_details');
      searchParams.set('investment_id', investmentId);
      
      navigate(`/login?${searchParams.toString()}`);
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "Unable to verify user credentials. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting investment inquiry:', { investmentId, userId });
      const { error } = await supabase
        .from('investment_inquiries')
        .insert([
          { 
            investment_id: investmentId,
            user_id: userId,
            status: 'pending'
          }
        ]);

      if (error) throw error;

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