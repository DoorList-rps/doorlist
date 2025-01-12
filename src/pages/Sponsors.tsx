import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet-async';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Tables } from "@/integrations/supabase/types";
import SponsorFilters from "@/components/sponsors/SponsorFilters";
import SponsorList from "@/components/sponsors/SponsorList";
import { useSponsorFilters } from "@/hooks/useSponsorFilters";

const Sponsors = () => {
  const { data: sponsors, isLoading, error } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('approved', true);

      if (error) throw error;
      return data as Tables<'sponsors'>[];
    }
  });

  const {
    searchTerm,
    setSearchTerm,
    selectedPropertyTypes,
    setSelectedPropertyTypes,
    selectedInvestmentTypes,
    setSelectedInvestmentTypes,
    sortBy,
    setSortBy,
    propertyTypes,
    investmentTypes,
    filteredSponsors
  } = useSponsorFilters(sponsors);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Real Estate Investment Sponsors | DoorList</title>
        <meta 
          name="description" 
          content="Discover top-tier real estate investment sponsors and their track records. Find trusted partners for your investment journey." 
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Our Sponsors</h1>
        
        <SponsorFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPropertyTypes={selectedPropertyTypes}
          setSelectedPropertyTypes={setSelectedPropertyTypes}
          selectedInvestmentTypes={selectedInvestmentTypes}
          setSelectedInvestmentTypes={setSelectedInvestmentTypes}
          sortBy={sortBy}
          setSortBy={setSortBy}
          propertyTypes={propertyTypes}
          investmentTypes={investmentTypes}
        />

        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doorlist-navy"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600">Error loading sponsors</h3>
            <p className="text-gray-500 mt-2">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
          </div>
        )}

        {!isLoading && !error && <SponsorList sponsors={filteredSponsors} />}
      </main>
      <Footer />
    </div>
  );
};

export default Sponsors;