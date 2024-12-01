import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const useSEOFooterLinks = () => {
  return useQuery({
    queryKey: ['seo-footer-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_footer_links')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return data as Tables<'seo_footer_links'>[];
    }
  });
};