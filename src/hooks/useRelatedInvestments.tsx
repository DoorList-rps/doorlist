import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRelatedInvestments = (sponsorName: string | undefined, currentInvestmentId: string | undefined) => {
  return useQuery({
    queryKey: ['related-investments', sponsorName, currentInvestmentId],
    queryFn: async () => {
      if (!sponsorName) throw new Error('No sponsor name provided');
      
      console.log('Fetching related investments for sponsor:', sponsorName);
      
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors (
            name,
            logo_url
          )
        `)
        .eq('sponsor_name', sponsorName)
        .neq('id', currentInvestmentId)
        .limit(3);

      if (error) {
        console.error('Error fetching related investments:', error);
        throw error;
      }
      
      console.log('Found related investments:', data?.length || 0);
      return data;
    },
    enabled: !!sponsorName && !!currentInvestmentId
  });
};