import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useInvestmentDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['investment', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Investment slug is required');
      
      console.log('Fetching investment details for slug:', slug);
      
      const { data: investment, error: investmentError } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors:sponsor_name(
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
        .single();

      if (investmentError) throw investmentError;
      if (!investment) throw new Error('Investment not found');

      // If we have a sponsor_name but no matching sponsor record, fetch the sponsor by name
      if (investment.sponsor_name && !investment.sponsors) {
        const { data: sponsorByName, error: sponsorError } = await supabase
          .from('sponsors')
          .select(`
            name,
            logo_url,
            year_founded,
            assets_under_management,
            deal_volume,
            number_of_deals,
            advertised_returns,
            holding_period,
            slug
          `)
          .eq('name', investment.sponsor_name)
          .single();

        if (!sponsorError && sponsorByName) {
          investment.sponsors = sponsorByName;
        } else {
          // If no sponsor found, create a basic sponsor object from the name
          investment.sponsors = {
            name: investment.sponsor_name,
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
      }
      
      return investment;
    },
    enabled: !!slug
  });
};