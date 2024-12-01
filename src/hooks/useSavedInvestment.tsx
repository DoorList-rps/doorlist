import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSavedInvestment = (investmentId: string | undefined, userId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const savedInvestmentQuery = useQuery({
    queryKey: ['saved-investment', investmentId, userId],
    queryFn: async () => {
      if (!userId || !investmentId) return null;

      const { data, error } = await supabase
        .from('saved_investments')
        .select('*')
        .eq('investment_id', investmentId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!userId && !!investmentId
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !investmentId) throw new Error('Not authenticated');

      if (savedInvestmentQuery.data) {
        const { error } = await supabase
          .from('saved_investments')
          .delete()
          .eq('investment_id', investmentId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_investments')
          .insert([
            { investment_id: investmentId, user_id: userId }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-investment', investmentId, userId] });
      queryClient.invalidateQueries({ queryKey: ['saved-investments'] });
      toast({
        title: savedInvestmentQuery.data ? "Investment Unsaved" : "Investment Saved",
        description: savedInvestmentQuery.data 
          ? "This investment has been removed from your saved investments."
          : "This investment has been added to your saved investments.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${savedInvestmentQuery.data ? 'unsave' : 'save'} investment. Please try again.`,
        variant: "destructive",
      });
    }
  });

  return {
    savedInvestment: savedInvestmentQuery.data,
    saveMutation
  };
};