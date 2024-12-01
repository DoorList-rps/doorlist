import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestmentHeader from "@/components/investment-detail/InvestmentHeader";
import InvestmentDetails from "@/components/investment-detail/InvestmentDetails";
import SponsorCard from "@/components/investment-detail/SponsorCard";
import SponsorDetails from "@/components/investment-detail/SponsorDetails";
import RelatedInvestments from "@/components/investment-detail/RelatedInvestments";
import { useEffect, useState } from "react";

const InvestmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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

  const { data: investment, isLoading, error } = useQuery({
    queryKey: ['investment', id],
    queryFn: async () => {
      if (!id) throw new Error('No investment ID provided');
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid investment ID format');
      }

      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors (
            name,
            logo_url,
            year_founded,
            assets_under_management,
            deal_volume,
            number_of_deals,
            advertised_returns,
            holding_period
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Investment not found');
      
      return data;
    },
    enabled: !!id
  });

  const { data: otherInvestments } = useQuery({
    queryKey: ['sponsor-investments', investment?.sponsor_id],
    queryFn: async () => {
      if (!investment?.sponsor_id) throw new Error('No sponsor ID available');

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('sponsor_id', investment.sponsor_id)
        .neq('id', id)
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!investment?.sponsor_id
  });

  const { data: savedInvestment } = useQuery({
    queryKey: ['saved-investment', id, userId],
    queryFn: async () => {
      if (!userId || !id) return null;

      const { data, error } = await supabase
        .from('saved_investments')
        .select('*')
        .eq('investment_id', id)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!userId && !!id
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !id) throw new Error('Not authenticated');

      if (savedInvestment) {
        const { error } = await supabase
          .from('saved_investments')
          .delete()
          .eq('investment_id', id)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_investments')
          .insert([
            { investment_id: id, user_id: userId }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-investment', id, userId] });
      queryClient.invalidateQueries({ queryKey: ['saved-investments'] });
      toast({
        title: savedInvestment ? "Investment Unsaved" : "Investment Saved",
        description: savedInvestment 
          ? "This investment has been removed from your saved investments."
          : "This investment has been added to your saved investments.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${savedInvestment ? 'unsave' : 'save'} investment. Please try again.`,
        variant: "destructive",
      });
    }
  });

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

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <InvestmentDetails investment={investment} />
          {investment.sponsors && (
            <div className="space-y-8">
              <SponsorCard sponsor={investment.sponsors} />
              <SponsorDetails sponsor={investment.sponsors} />
            </div>
          )}
        </div>

        {otherInvestments && otherInvestments.length > 0 && (
          <RelatedInvestments 
            investments={otherInvestments}
            sponsorName={investment.sponsors?.name || ''}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default InvestmentDetail;