import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 20;

const Sponsors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['sponsors', currentPage, searchTerm],
    queryFn: async () => {
      console.log('Starting sponsor query with params:', { currentPage, searchTerm, ITEMS_PER_PAGE });
      
      try {
        // First, let's do a basic count without any conditions
        console.log('Attempting basic count query...');
        const { count, error: countError } = await supabase
          .from('Sponsors')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.error('Count query error:', countError);
          throw countError;
        }
        
        console.log('Basic count result:', count);

        // Now let's do the simplest possible data query
        console.log('Attempting basic data query...');
        const { data: sponsorsData, error: queryError } = await supabase
          .from('Sponsors')
          .select(`
            "Primary_Key",
            "Name",
            "Logo",
            "Description",
            "Short Description",
            "Year Founded",
            "Assets Under Management",
            "Property Type"
          `)
          .range(0, 19);  // Just get the first 20 records for now

        console.log('Query completed. Results:', {
          error: queryError?.message || 'none',
          dataReceived: !!sponsorsData,
          recordCount: sponsorsData?.length || 0,
          firstRecord: sponsorsData?.[0] || 'none'
        });

        if (queryError) {
          console.error('Data query error:', queryError);
          throw queryError;
        }

        if (!sponsorsData) {
          console.error('No data returned from query');
          throw new Error('No data returned from query');
        }

        return {
          sponsors: sponsorsData as Tables<'Sponsors'>[],
          totalCount: count || 0
        };
      } catch (err) {
        console.error('Query execution error:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 30000,
  });

  if (error) {
    console.error('Query error details:', error);
    toast({
      variant: "destructive",
      title: "Error loading sponsors",
      description: "Please try again later. Error: " + (error as Error).message,
    });
  }

  const totalPages = data ? Math.ceil(data.totalCount / ITEMS_PER_PAGE) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Our Sponsors</h1>
        
        <div className="relative max-w-md mb-8">
          <Input
            type="text"
            placeholder="Search sponsors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doorlist-navy"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600">Error loading sponsors</h3>
            <p className="text-gray-500 mt-2">Error details: {(error as Error).message}</p>
          </div>
        ) : !data || !data.sponsors || data.sponsors.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No sponsors found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.sponsors.map((sponsor) => (
                <Link key={sponsor.Primary_Key} to={`/sponsors/${sponsor.Primary_Key}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="flex items-center">
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
                      <CardTitle className="text-xl text-center">{sponsor.Name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{sponsor["Short Description"] || sponsor.Description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Experience</span>
                          <span className="font-medium">{sponsor["Year Founded"] ? `Since ${sponsor["Year Founded"]}` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">AUM</span>
                          <span className="font-medium">{sponsor["Assets Under Management"] || 'N/A'}</span>
                        </div>
                        {sponsor["Property Type"] && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {sponsor["Property Type"].split(',').map((type, index) => (
                              <span
                                key={index}
                                className="bg-doorlist-navy/10 text-doorlist-navy px-3 py-1 rounded-full text-sm"
                              >
                                {type.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Sponsors;