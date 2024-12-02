import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type InvestmentWithSponsor = Tables<'investments'> & {
  sponsors: Pick<Tables<'sponsors'>, 
    'name' | 
    'logo_url' | 
    'year_founded' | 
    'assets_under_management' | 
    'deal_volume' | 
    'number_of_deals' | 
    'advertised_returns' | 
    'holding_period' |
    'slug'
  > | null;
};

export const useInvestmentDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['investment', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Investment slug is required');
      
      console.log('Fetching investment details for slug:', slug);
      
      // First, get the investment details
      const { data: investmentData, error: investmentError } = await supabase
        .from('investments')
        .select('*')
        .eq('slug', slug)
        .single();

      if (investmentError) throw investmentError;
      if (!investmentData) throw new Error('Investment not found');

      const result: InvestmentWithSponsor = {
        ...investmentData,
        sponsors: null
      };

      // Then, if we have a sponsor_name, get the sponsor details
      if (result.sponsor_name) {
        const { data: sponsorData, error: sponsorError } = await supabase
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
          .eq('name', result.sponsor_name)
          .single();

        if (!sponsorError && sponsorData) {
          result.sponsors = sponsorData;
        } else {
          // If no sponsor found, create a basic sponsor object from the name
          result.sponsors = {
            name: result.sponsor_name,
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
      
      return result;
    },
    enabled: !!slug
  });
};