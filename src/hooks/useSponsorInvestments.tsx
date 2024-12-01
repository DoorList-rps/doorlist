import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSponsorInvestments = (sponsorName: string | undefined) => {
  return useQuery({
    queryKey: ['sponsor-investments', sponsorName],
    queryFn: async () => {
      if (!sponsorName) throw new Error('No sponsor name provided');
      
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('sponsor_name', sponsorName)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching sponsor investments:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!sponsorName
  });
};