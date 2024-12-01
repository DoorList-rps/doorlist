import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

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
            logo_url
          )
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'pending');

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
            location_state
          )
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'pending');

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
          <p className="text-gray-500">No pending connections or inquiries</p>
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
                <div key={inquiry.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                  {inquiry.investments?.hero_image_url && (
                    <img
                      src={inquiry.investments.hero_image_url}
                      alt={inquiry.investments.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{inquiry.investments?.name}</p>
                    {inquiry.investments?.minimum_investment && (
                      <p className="text-sm text-gray-500">
                        Min. Investment: ${inquiry.investments.minimum_investment.toLocaleString()}
                      </p>
                    )}
                    {(inquiry.investments?.location_city || inquiry.investments?.location_state) && (
                      <p className="text-sm text-gray-500">
                        {[inquiry.investments.location_city, inquiry.investments.location_state]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Requested on {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {introductions && introductions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Sponsor Introductions</h3>
              {introductions.map((introduction) => (
                <div key={introduction.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                  {introduction.sponsors?.logo_url && (
                    <img
                      src={introduction.sponsors.logo_url}
                      alt={introduction.sponsors.name}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <div>
                    <p className="font-medium">{introduction.sponsors?.name}</p>
                    <p className="text-sm text-gray-500">
                      Introduction requested on {new Date(introduction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionsInProgress;