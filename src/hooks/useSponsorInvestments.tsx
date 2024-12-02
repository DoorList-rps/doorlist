import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSponsorInvestments = (sponsorName: string | undefined) => {
  return useQuery({
    queryKey: ['sponsor-investments', sponsorName],
    queryFn: async () => {
      if (!sponsorName) throw new Error('No sponsor name provided');
      
      console.log('Fetching investments for sponsor:', sponsorName);
      
      // First, let's verify the sponsor exists and get their exact name
      const { data: sponsor, error: sponsorError } = await supabase
        .from('sponsors')
        .select('name')
        .eq('name', sponsorName)
        .single();

      if (sponsorError) {
        console.error('Error fetching sponsor:', sponsorError);
        throw sponsorError;
      }

      if (!sponsor) {
        console.error('Sponsor not found:', sponsorName);
        throw new Error('Sponsor not found');
      }

      // Now fetch investments using the exact sponsor name
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
            holding_period,
            slug
          )
        `)
        .eq('sponsor_name', sponsor.name)
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