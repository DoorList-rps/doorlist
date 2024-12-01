import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorIntroduction extends Tables<'sponsor_introductions'> {
  sponsors: Tables<'sponsors'>;
}

const ConnectionsInProgress = () => {
  const { data: introductions, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!introductions?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">No pending introductions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {introductions.map((introduction) => (
            <div key={introduction.id} className="flex items-center space-x-4">
              {introduction.sponsors.logo_url && (
                <img
                  src={introduction.sponsors.logo_url}
                  alt={introduction.sponsors.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div>
                <p className="font-medium">{introduction.sponsors.name}</p>
                <p className="text-sm text-gray-500">Introduction requested on {new Date(introduction.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionsInProgress;