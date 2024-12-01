import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useInvestmentDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['investment', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Investment slug is required');
      
      console.log('Fetching investment details for slug:', slug);
      
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors!left (
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
        .eq('slug', slug)
        .maybeSingle(); // Use maybeSingle instead of single

      if (error) throw error;
      if (!data) throw new Error('Investment not found');

      // If we have a sponsor_name but no matching sponsor record, create a basic sponsor object
      if (data.sponsor_name && !data.sponsors) {
        data.sponsors = {
          name: data.sponsor_name,
          logo_url: null,
          year_founded: null,
          assets_under_management: null,
          deal_volume: null,
          number_of_deals: null,
          advertised_returns: null,
          holding_period: null,
          slug: null
        };
      }
      
      return data;
    },
    enabled: !!slug
  });
};