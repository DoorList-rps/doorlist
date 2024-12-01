import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRelatedInvestments = (sponsorName: string | undefined, currentInvestmentId: string | undefined) => {
  return useQuery({
    queryKey: ['sponsor-investments', sponsorName],
    queryFn: async () => {
      if (!sponsorName) throw new Error('No sponsor name available');

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('sponsor_name', sponsorName)
        .neq('id', currentInvestmentId)
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!sponsorName
  });
};