import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const SponsorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: sponsor, isLoading, error } = useQuery({
    queryKey: ['sponsor', id],
    queryFn: async () => {
      if (!id) throw new Error('No sponsor ID provided');
      
      // Validate UUID format using regex
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid sponsor ID format');
      }

      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Sponsor not found');
      
      return data as Tables<'sponsors'>;
    },
    enabled: !!id
  });

  const handleContactClick = () => {
    toast({
      title: "Contact Request Sent",
      description: "Thank you for your interest. Our team will contact you shortly about this sponsor.",
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error instanceof Error ? error.message : 'Failed to load sponsor'}</p>
        </div>
      </div>
    );
  }

  if (!sponsor) {
    return <div className="min-h-screen flex items-center justify-center">Sponsor not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={sponsor.logo_url || '/placeholder.svg'}
              alt={sponsor.name || 'Sponsor logo'}
              className="w-full max-h-[300px] object-contain rounded-lg bg-gray-50 p-8"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-doorlist-navy mb-4">{sponsor.name}</h1>
            <p className="text-gray-600 mb-6">{sponsor.description}</p>
            
            <Card className="mb-6">
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="text-xl font-semibold">
                    {sponsor.year_founded ? `Since ${sponsor.year_founded}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Assets Under Management</p>
                  <p className="text-xl font-semibold">{sponsor.assets_under_management || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="text-xl font-semibold">{sponsor.headquarters || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

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

            <Button
              onClick={handleContactClick}
              size="lg"
              className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
            >
              Contact This Sponsor
            </Button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Track Record</h2>
            <Card>
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-doorlist-navy">{sponsor.number_of_deals || '0'}</p>
                  <p className="text-gray-500">Total Deals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-doorlist-navy">{sponsor.deal_volume || 'N/A'}</p>
                  <p className="text-gray-500">Deal Volume</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-doorlist-navy">{sponsor.advertised_returns || 'N/A'}</p>
                  <p className="text-gray-500">Target Returns</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-doorlist-navy">{sponsor.minimum_investment || 'N/A'}</p>
                  <p className="text-gray-500">Minimum Investment</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Additional Information</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Investment Types</p>
                    <p className="text-gray-600">
                      {sponsor.investment_types ? sponsor.investment_types.join(', ') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Holding Period</p>
                    <p className="text-gray-600">{sponsor.holding_period || 'N/A'}</p>
                  </div>
                  {sponsor.linkedin_url && (
                    <div>
                      <p className="font-semibold">LinkedIn</p>
                      <a 
                        href={sponsor.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-doorlist-navy hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SponsorDetail;