import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";
import InvestmentInquiryCard from "./InvestmentInquiryCard";
import SponsorIntroductionCard from "./SponsorIntroductionCard";

interface SponsorIntroduction extends Tables<'sponsor_introductions'> {
  sponsors: Tables<'sponsors'>;
}

interface InvestmentInquiry extends Tables<'investment_inquiries'> {
  investments: Tables<'investments'>;
}

const ConnectionsInProgress = () => {
  const { data: introductions, isLoading: isLoadingIntroductions } = useQuery({
    queryKey: ['sponsor-introductions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('sponsor_introductions')
        .select(`
          *,
          sponsors (
            name,
            logo_url,
            slug
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data as SponsorIntroduction[];
    }
  });

  const { data: inquiries, isLoading: isLoadingInquiries } = useQuery({
    queryKey: ['investment-inquiries'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('investment_inquiries')
        .select(`
          *,
          investments (
            name,
            hero_image_url,
            minimum_investment,
            location_city,
            location_state,
            slug
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data as InvestmentInquiry[];
    }
  });

  const isLoading = isLoadingIntroductions || isLoadingInquiries;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!introductions?.length && !inquiries?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">No connections or inquiries</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {inquiries && inquiries.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Investment Inquiries</h3>
              {inquiries.map((inquiry) => (
                <InvestmentInquiryCard key={inquiry.id} inquiry={inquiry} />
              ))}
            </div>
          )}

          {introductions && introductions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Sponsor Introductions</h3>
              {introductions.map((introduction) => (
                <SponsorIntroductionCard key={introduction.id} introduction={introduction} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionsInProgress;