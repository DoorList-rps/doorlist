
import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Tables } from "@/integrations/supabase/types";
import SponsorFilters from "@/components/sponsors/SponsorFilters";
import SponsorList from "@/components/sponsors/SponsorList";
import { useSponsorFilters } from "@/hooks/useSponsorFilters";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-4xl font-bold text-doorlist-navy">Our Sponsors</h1>
          <Link to="/submit-investment" className="mt-4 md:mt-0">
            <Button className="bg-doorlist-salmon hover:bg-doorlist-salmon/90 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit Investment
            </Button>
          </Link>
        </div>
        
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-doorlist-navy mb-2">Are you a sponsor?</h2>
          <p className="text-gray-600 mb-4">
            DoorList provides exposure to qualified investors for your real estate investments. 
            Submit your investment opportunity for our team to review and get featured on our platform.
          </p>
          <Link to="/submit-investment" className="text-doorlist-salmon hover:underline font-medium">
            Submit an investment opportunity →
          </Link>
        </div>
        
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
