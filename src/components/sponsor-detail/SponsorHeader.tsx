import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

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
          .maybeSingle();
        
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
      if (error.code === '23505') {
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

      <div className="space-y-6">
        <div className="bg-gray-50 p-8 rounded-lg">
          <img
            src={sponsor.logo_url || '/placeholder.svg'}
            alt={`${sponsor.name} logo`}
            className="w-full max-h-[200px] object-contain mb-6"
          />
          
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Sub-asset Class</TableCell>
                <TableCell>{sponsor.property_types?.join(', ') || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Investment Type</TableCell>
                <TableCell>{sponsor.investment_types?.join(', ') || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Minimum Investment</TableCell>
                <TableCell>{sponsor.minimum_investment || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Deal Volume</TableCell>
                <TableCell>{sponsor.deal_volume || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Assets Under Management</TableCell>
                <TableCell>{sponsor.assets_under_management || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Number of Deals</TableCell>
                <TableCell>{sponsor.number_of_deals || 'N/A'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SponsorHeader;