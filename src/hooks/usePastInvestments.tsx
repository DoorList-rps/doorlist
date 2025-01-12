import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePastInvestments = (sponsorName: string | undefined) => {
  return useQuery({
    queryKey: ['past-investments', sponsorName],
    queryFn: async () => {
      if (!sponsorName) return [];
      
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('sponsor_name', sponsorName)
        .eq('status', 'Closed')
        .eq('approved', true);

      if (error) {
        console.error('Error fetching past investments:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!sponsorName
  });
};