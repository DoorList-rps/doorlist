import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import SponsorIntroduction from "./SponsorIntroduction";
import SponsorInfo from "./SponsorInfo";

interface SponsorHeaderProps {
  sponsor: Tables<'sponsors'>;
}

const SponsorHeader = ({ sponsor }: SponsorHeaderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, [sponsor.id]);

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-doorlist-navy mb-2">{sponsor.name}</h1>
          <div className="text-gray-600 space-y-1">
            {sponsor.year_founded && (
              <p>Founded in {sponsor.year_founded}</p>
            )}
            {sponsor.headquarters && (
              <p>Headquarters: {sponsor.headquarters}</p>
            )}
          </div>
        </div>

        {sponsor.description && (
          <p className="text-gray-600">{sponsor.description}</p>
        )}
        
        <SponsorIntroduction
          sponsor={sponsor}
          isLoggedIn={isLoggedIn}
          userId={userId}
        />
      </div>

      <div className="space-y-6">
        <SponsorInfo sponsor={sponsor} />
      </div>
    </div>
  );
};

export default SponsorHeader;