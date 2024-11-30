import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";

const InvestmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: investment, isLoading, error } = useQuery({
    queryKey: ['investment', id],
    queryFn: async () => {
      if (!id) throw new Error('No investment ID provided');
      
      // Validate UUID format using regex
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid investment ID format');
      }

      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors (
            name,
            logo_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Investment not found');
      
      return data as Tables<'investments'> & {
        sponsors: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> | null
      };
    },
    enabled: !!id
  });

  const { data: otherInvestments } = useQuery({
    queryKey: ['sponsor-investments', investment?.sponsor_id],
    queryFn: async () => {
      if (!investment?.sponsor_id) throw new Error('No sponsor ID available');

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('sponsor_id', investment.sponsor_id)
        .neq('id', id)
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!investment?.sponsor_id
  });

  const handleContactClick = () => {
    toast({
      title: "Contact Request Sent",
      description: "Thank you for your interest. Our team will contact you shortly.",
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
          <p className="text-gray-600">{error instanceof Error ? error.message : 'Failed to load investment'}</p>
        </div>
      </div>
    );
  }

  if (!investment) {
    return <div className="min-h-screen flex items-center justify-center">Investment not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={investment.hero_image_url || '/placeholder.svg'}
              alt={investment.name}
              className="w-full h-[400px] object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-doorlist-navy mb-4">{investment.name}</h1>
            <p className="text-gray-600 mb-6">{investment.description || investment.short_description}</p>
            
            <Card className="mb-6">
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                {investment.minimum_investment && (
                  <div>
                    <p className="text-gray-500">Minimum Investment</p>
                    <p className="text-xl font-semibold">${investment.minimum_investment.toLocaleString()}</p>
                  </div>
                )}
                {investment.target_return && (
                  <div>
                    <p className="text-gray-500">Target Return</p>
                    <p className="text-xl font-semibold">{investment.target_return}</p>
                  </div>
                )}
                {(investment.location_city || investment.location_state) && (
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-xl font-semibold">
                      {[investment.location_city, investment.location_state]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}
                {investment.status && (
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-xl font-semibold capitalize">{investment.status}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleContactClick}
              size="lg"
              className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
            >
              Contact Us About This Investment
            </Button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Investment Details</h2>
            <Card>
              <CardContent className="p-6">
                {[
                  { label: 'Property Type', value: investment.property_type },
                  { label: 'Investment Type', value: investment.investment_type },
                  { label: 'Hold Period', value: investment.hold_period },
                  { label: 'Distribution Frequency', value: investment.distribution_frequency },
                  { label: 'Total Equity', value: investment.total_equity ? `$${investment.total_equity.toLocaleString()}` : null },
                  { label: 'Equity Remaining', value: investment.equity_remaining ? `$${investment.equity_remaining.toLocaleString()}` : null },
                  { label: 'Accredited Only', value: investment.accredited_only ? 'Yes' : 'No' },
                  { label: 'Closing Date', value: investment.closing_date ? new Date(investment.closing_date).toLocaleDateString() : null }
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {investment.sponsors && (
            <div>
              <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Sponsor</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={investment.sponsors.logo_url || '/placeholder.svg'}
                      alt={investment.sponsors.name}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{investment.sponsors.name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {otherInvestments && otherInvestments.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-doorlist-navy mb-6">More Investments from {investment.sponsors?.name}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherInvestments.map((inv) => (
                <Link key={inv.id} to={`/investments/${inv.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <img
                        src={inv.thumbnail_url || inv.hero_image_url || '/placeholder.svg'}
                        alt={inv.name}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{inv.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{inv.short_description}</p>
                      {inv.minimum_investment && (
                        <p className="mt-2 text-sm text-gray-500">
                          Min. Investment: ${inv.minimum_investment.toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default InvestmentDetail;