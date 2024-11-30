import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Sponsors = () => {
  const { toast } = useToast();

  const { data: sponsors, isLoading, error } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      console.log('Fetching sponsors...');
      
      const { data, error } = await supabase
        .from('Sponsors')
        .select('Primary_Key, Name, Logo, Description, "Short Description", "Year Founded", "Assets Under Management", "Property Type"');

      console.log('Query response:', { data, error });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      return data || [];
    }
  });

  if (error) {
    console.error('Error fetching sponsors:', error);
    toast({
      variant: "destructive",
      title: "Error loading sponsors",
      description: "Please try again later",
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Our Sponsors</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doorlist-navy"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600">Error loading sponsors</h3>
            <p className="text-gray-500 mt-2">Please try again later</p>
          </div>
        ) : !sponsors || sponsors.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No sponsors found</h3>
            <p className="text-gray-500 mt-2">Please check back later</p>
          </div>
        ) : (
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
                  {sponsor["Short Description"] || sponsor.Description || 'No description available'}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Founded</span>
                    <span className="font-medium">
                      {sponsor["Year Founded"] ? `${sponsor["Year Founded"]}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AUM</span>
                    <span className="font-medium">
                      {sponsor["Assets Under Management"] || 'N/A'}
                    </span>
                  </div>
                </div>

                {sponsor["Property Type"] && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sponsor["Property Type"].split(',').map((type, index) => (
                      <span
                        key={index}
                        className="bg-doorlist-navy/10 text-doorlist-navy px-2 py-1 rounded-full text-sm"
                      >
                        {type.trim()}
                      </span>
                    ))}
                  </div>
                )}
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