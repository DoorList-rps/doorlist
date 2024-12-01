import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useInvestmentDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['investment', id],
    queryFn: async () => {
      if (!id) throw new Error('No investment ID provided');
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid investment ID format');
      }

      const { data: investment, error: investmentError } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (investmentError) throw investmentError;
      if (!investment) throw new Error('Investment not found');

      // Fetch sponsor details using sponsor_name
      const { data: sponsor, error: sponsorError } = await supabase
        .from('sponsors')
        .select(`
          name,
          logo_url,
          year_founded,
          assets_under_management,
          deal_volume,
          number_of_deals,
          advertised_returns,
          holding_period
        `)
        .eq('name', investment.sponsor_name)
        .single();

      if (sponsorError) {
        console.error('Error fetching sponsor:', sponsorError);
      }

      return {
        ...investment,
        sponsors: sponsor
      };
    },
    enabled: !!id
  });
};