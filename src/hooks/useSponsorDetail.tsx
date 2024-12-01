import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSponsorDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['sponsor', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Sponsor slug is required');
      
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Sponsor not found');
      
      return data;
    },
    enabled: !!slug
  });
};