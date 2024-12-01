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

const InvestmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { data: investment, isLoading, error } = useInvestmentDetail(id);
  const { data: otherInvestments } = useRelatedInvestments(investment?.sponsor_id, id);
  const { savedInvestment, saveMutation } = useSavedInvestment(id, userId);

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error instanceof Error ? error.message : 'Failed to load investment'}</p>
        </div>
      </div>
    );
  }

  if (!investment) {
    return <div className="min-h-screen flex items-center justify-center">Investment not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <InvestmentHeader 
          investment={investment}
          onSaveInvestment={handleSaveInvestment}
          isSaved={!!savedInvestment}
          isLoggedIn={isLoggedIn}
        />
        <InvestmentContent 
          investment={investment}
          otherInvestments={otherInvestments}
        />
      </main>
      <Footer />
    </div>
  );
};

export default InvestmentDetail;