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
      console.log('Fetching sponsors with params:', { currentPage, searchTerm });
      
      try {
        let query = supabase
          .from('Sponsors')
          .select('*', { count: 'exact' });
        
        // Add search filter if searchTerm exists
        if (searchTerm) {
          query = query.ilike('Name', `%${searchTerm}%`);
        }
        
        // Add pagination
        const from = currentPage * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        
        console.log('Query range:', { from, to });
        
        const { data, error, count } = await query
          .range(from, to)
          .order('Name', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Query results:', { 
          resultCount: data?.length, 
          totalCount: count,
          firstItem: data?.[0]
        });

        return {
          sponsors: data as Tables<'Sponsors'>[],
          totalCount: count || 0
        };
      } catch (err) {
        console.error('Query execution error:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 30000, // Cache results for 30 seconds
  });

  if (error) {
    console.error('Query error:', error);
    toast({
      variant: "destructive",
      title: "Error loading sponsors",
      description: "Please try again later.",
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
            <p className="text-gray-500 mt-2">Please try refreshing the page</p>
          </div>
        ) : !data || data.sponsors.length === 0 ? (
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