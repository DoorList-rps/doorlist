import { useState } from "react";
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
  const [hasRequested, setHasRequested] = useState(false);
  const { toast } = useToast();

  const handleInquiry = async () => {
    if (!isLoggedIn || !userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request investment details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('investment_inquiries')
        .insert([
          { 
            investment_id: investmentId,
            user_id: userId,
          }
        ]);

      if (error) throw error;

      setHasRequested(true);
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

  if (hasRequested) {
    return (
      <Button 
        disabled 
        className="w-full bg-green-500 hover:bg-green-500"
      >
        Request Submitted
      </Button>
    );
  }

  return (
    <Button
      onClick={handleInquiry}
      disabled={isSubmitting || !isLoggedIn}
      className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
    >
      {isSubmitting ? "Submitting..." : "Request Investment Details"}
    </Button>
  );
};

export default InvestmentInquiryButton;