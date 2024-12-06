import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestmentHeader from "@/components/investment-detail/InvestmentHeader";
import InvestmentContent from "@/components/investment-detail/InvestmentContent";
import { useEffect, useState } from "react";
import { useInvestmentDetail } from "@/hooks/useInvestmentDetail";
import { useRelatedInvestments } from "@/hooks/useRelatedInvestments";
import { useSavedInvestment } from "@/hooks/useSavedInvestment";
import { Helmet } from 'react-helmet-async';

const InvestmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { data: investment, isLoading, error } = useInvestmentDetail(slug);
  const { data: otherInvestments } = useRelatedInvestments(investment?.sponsor_name, investment?.id);
  const { savedInvestment, saveMutation } = useSavedInvestment(investment?.id, userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSaveInvestment = () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save investments.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate();
  };

  if (isLoading) {
    return (
      <div>
        <Helmet>
          <title>Loading Investment | DoorList</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div>
        <Helmet>
          <title>Investment Not Found | DoorList</title>
          <meta name="description" content="The investment opportunity you're looking for could not be found." />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">Investment not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{`${investment.name} | Investment Opportunity | DoorList`}</title>
        <meta name="description" content={investment.short_description || `Learn about ${investment.name}, a real estate investment opportunity by ${investment.sponsor_name}.`} />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <InvestmentHeader 
          investment={investment}
          onSaveInvestment={handleSaveInvestment}
          isSaved={!!savedInvestment}
          isLoggedIn={isLoggedIn}
          userId={userId}
        />
        <InvestmentContent 
          investment={investment}
        />
      </main>
      <Footer />
    </div>
  );
};

export default InvestmentDetail;
