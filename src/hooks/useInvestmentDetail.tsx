import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useInvestmentDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['investment', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Investment slug is required');
      
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
            website_url,
            slug
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Investment not found');
      
      return data;
    },
    enabled: !!slug
  });
};