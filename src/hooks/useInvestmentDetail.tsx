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
            holding_period
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Investment not found');
      
      return data;
    },
    enabled: !!id
  });
};