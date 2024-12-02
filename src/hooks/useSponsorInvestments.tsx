import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSponsorInvestments = (sponsorName: string | undefined) => {
  return useQuery({
    queryKey: ['sponsor-investments', sponsorName],
    queryFn: async () => {
      if (!sponsorName) throw new Error('No sponsor name provided');
      
      console.log('Fetching investments for sponsor:', sponsorName);
      
      // Use a single query that matches the working SQL approach
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors!inner (
            name,
            logo_url,
            year_founded,
            assets_under_management,
            deal_volume,
            number_of_deals,
            advertised_returns,
            holding_period,
            slug
          )
        `)
        .eq('sponsors.name', sponsorName)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching sponsor investments:', error);
        throw error;
      }

      console.log('Raw query result:', data);
      console.log('Number of investments found:', data?.length || 0);
      console.log('First investment details:', data?.[0]);
      
      return data;
    },
    enabled: !!sponsorName
  });
};