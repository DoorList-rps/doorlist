import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorHeaderProps {
  sponsor: Tables<'sponsors'>;
}

const SponsorHeader = ({ sponsor }: SponsorHeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [introductionStatus, setIntroductionStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);

      if (session?.user?.id && sponsor.id) {
        const { data } = await supabase
          .from('sponsor_introductions')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('sponsor_id', sponsor.id)
          .single();
        
        if (data) {
          setIntroductionStatus(data.status);
        }
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, [sponsor.id]);

  const handleContactClick = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request an introduction.",
      });
      navigate("/login");
      return;
    }

    if (!userId || !sponsor.id) return;

    const { error } = await supabase
      .from('sponsor_introductions')
      .insert([
        { user_id: userId, sponsor_id: sponsor.id }
      ]);

    if (error) {
      if (error.code === '23505') { // Unique violation
        toast({
          title: "Already Requested",
          description: "You have already requested an introduction to this sponsor.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to request introduction. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    setIntroductionStatus('pending');
    toast({
      title: "Introduction Requested",
      description: "We'll connect you with " + sponsor.name + " shortly.",
    });
  };

  const getButtonText = () => {
    if (introductionStatus === 'pending') {
      return `Connecting you with ${sponsor.name}...`;
    }
    return `I'd Like a Personal Introduction to ${sponsor.name}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div>
        <img
          src={sponsor.logo_url || '/placeholder.svg'}
          alt={sponsor.name || 'Sponsor logo'}
          className="w-full max-h-[300px] object-contain rounded-lg bg-gray-50 p-8 mb-6"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-doorlist-navy mb-4">{sponsor.name}</h1>
        <p className="text-gray-600 mb-6">{sponsor.description}</p>
        
        {sponsor.property_types && sponsor.property_types.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {sponsor.property_types.map((type) => (
              <span
                key={type}
                className="bg-doorlist-navy/10 text-doorlist-navy px-4 py-2 rounded-full"
              >
                {type.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleContactClick}
            size="lg"
            className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90 disabled:bg-gray-300"
            disabled={introductionStatus === 'pending'}
          >
            {getButtonText()}
          </Button>

          {sponsor.website_url && (
            <Button
              onClick={() => window.open(sponsor.website_url, '_blank')}
              size="lg"
              className="w-full bg-doorlist-salmon/20 hover:bg-doorlist-salmon/30 text-doorlist-salmon"
            >
              View Sponsor Website
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorHeader;