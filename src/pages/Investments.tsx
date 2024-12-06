import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Investments = () => {
  const { data: investments, isLoading, error } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('approved', true);  // Only fetch approved investments

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Real Estate Investment Opportunities | DoorList</title>
        <meta name="description" content="Browse our curated selection of institutional-quality real estate investment opportunities from top sponsors." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Investment Opportunities</h1>
        
        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doorlist-navy"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600">Error loading investments</h3>
            <p className="text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          </div>
        )}

        {!isLoading && !error && (!investments || investments.length === 0) && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No investments found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}

        {investments && investments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) => (
              <div key={investment.id} className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold">{investment.name}</h2>
                <p className="text-gray-600">{investment.short_description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Investments;
