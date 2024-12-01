import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRelatedInvestments = (sponsorId: string | undefined, currentInvestmentId: string | undefined) => {
  return useQuery({
    queryKey: ['sponsor-investments', sponsorId],
    queryFn: async () => {
      if (!sponsorId) throw new Error('No sponsor ID available');

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('sponsor_id', sponsorId)
        .neq('id', currentInvestmentId)
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!sponsorId
  });
};