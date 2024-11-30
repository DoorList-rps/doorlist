import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Sponsors = () => {
  const { data: sponsors, isLoading, error } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      console.log('Starting sponsor fetch...');
      
      const { data, error } = await supabase
        .from('Sponsors')
        .select('Primary_Key, Name, Logo, Description')
        .limit(10);

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        console.log('No data returned from Supabase');
        return [];
      }

      console.log('Sponsors found:', data.length);
      return data;
    }
  });

  console.log('Component render state:', { isLoading, error, sponsorsCount: sponsors?.length });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Our Sponsors</h1>
        
        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doorlist-navy"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600">Error loading sponsors</h3>
            <p className="text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          </div>
        )}

        {!isLoading && !error && (!sponsors || sponsors.length === 0) && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No sponsors found</h3>
            <p className="text-gray-500 mt-2">Please check back later</p>
          </div>
        )}

        {sponsors && sponsors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor) => (
              <div 
                key={sponsor.Primary_Key}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center">
                  {sponsor.Logo && (
                    <img
                      src={sponsor.Logo}
                      alt={`${sponsor.Name || 'Sponsor'} logo`}
                      className="w-32 h-32 object-contain mb-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  )}
                  <h3 className="text-xl font-semibold text-center mb-2">
                    {sponsor.Name || 'Unnamed Sponsor'}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4 text-center">
                  {sponsor.Description || 'No description available'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Sponsors;