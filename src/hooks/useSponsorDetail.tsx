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
        .maybeSingle();

      if (error) {
        console.error('Error fetching sponsor:', error);
        throw error;
      }
      
      if (!data) {
        console.log(`No sponsor found with slug: ${slug}`);
        return null;
      }
      
      return data;
    },
    enabled: !!slug
  });
};