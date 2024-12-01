import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorIntroduction extends Tables<'sponsor_introductions'> {
  sponsors: Tables<'sponsors'>;
}

interface InvestmentInquiry extends Tables<'investment_inquiries'> {
  investments: Tables<'investments'>;
}

const StatusTracker = ({ status }: { status: string }) => {
  const stages = [
    { id: 'viewed', label: 'Viewed Profile' },
    { id: 'requested', label: 'Connection Requested' },
    { id: 'connected', label: 'Connection Made by DoorList' },
    { id: 'completed', label: 'Investment Complete' }
  ];

  const currentStageIndex = stages.findIndex(stage => stage.id === status) || 1;

  return (
    <div className="flex items-center justify-between w-full mt-4">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex flex-col items-center flex-1">
          {index > 0 && (
            <div className={`h-0.5 w-full -ml-2 ${index <= currentStageIndex ? 'bg-doorlist-salmon' : 'bg-gray-200'}`} />
          )}
          <div className="flex flex-col items-center">
            {index <= currentStageIndex ? (
              <CheckCircle2 className="h-6 w-6 text-doorlist-salmon" />
            ) : (
              <Circle className="h-6 w-6 text-gray-300" />
            )}
            <span className="text-xs text-gray-600 text-center mt-1">{stage.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

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
            location_state,
            slug
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
                <div key={inquiry.id} className="space-y-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    {inquiry.investments?.hero_image_url && (
                      <img
                        src={inquiry.investments.hero_image_url}
                        alt={inquiry.investments.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-grow">
                      <Link 
                        to={`/investments/${inquiry.investments?.slug}`}
                        className="font-medium hover:text-doorlist-salmon"
                      >
                        {inquiry.investments?.name}
                      </Link>
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
                  <StatusTracker status={inquiry.status || 'requested'} />
                </div>
              ))}
            </div>
          )}

          {introductions && introductions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Sponsor Introductions</h3>
              {introductions.map((introduction) => (
                <div key={introduction.id} className="space-y-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    {introduction.sponsors?.logo_url && (
                      <img
                        src={introduction.sponsors.logo_url}
                        alt={introduction.sponsors.name}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div className="flex-grow">
                      <Link 
                        to={`/sponsors/${introduction.sponsors?.slug}`}
                        className="font-medium hover:text-doorlist-salmon"
                      >
                        {introduction.sponsors?.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Introduction requested on {new Date(introduction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StatusTracker status={introduction.status || 'requested'} />
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