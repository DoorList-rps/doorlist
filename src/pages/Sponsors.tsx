import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Tables } from "@/integrations/supabase/types";
import SponsorCard from "@/components/sponsors/SponsorCard";
import SponsorFilters from "@/components/sponsors/SponsorFilters";
import type { SortOption } from "@/components/sponsors/types";

const Sponsors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedInvestmentTypes, setSelectedInvestmentTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const { data: sponsors, isLoading, error } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('approved', true);  // Only fetch approved sponsors

      if (error) throw error;
      return data as Tables<'sponsors'>[];
    }
  });

  // Extract unique property and investment types
  const propertyTypes = sponsors
    ? Array.from(new Set(sponsors.flatMap(s => s.property_types || [])))
    : [];
  
  const investmentTypes = sponsors
    ? Array.from(new Set(sponsors.flatMap(s => s.investment_types || [])))
    : [];

  const sortSponsors = (sponsors: Tables<'sponsors'>[]) => {
    const sortedSponsors = [...sponsors];
    
    switch (sortBy) {
      case "nameAsc":
        return sortedSponsors.sort((a, b) => a.name.localeCompare(b.name));
      case "nameDesc":
        return sortedSponsors.sort((a, b) => b.name.localeCompare(a.name));
      case "returnsDesc":
        return sortedSponsors.sort((a, b) => {
          const getNumericReturn = (returns: string | null) => {
            if (!returns) return 0;
            const match = returns.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getNumericReturn(b.advertised_returns) - getNumericReturn(a.advertised_returns);
        });
      case "latest":
      default:
        return sortedSponsors.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  };

  const filteredSponsors = sponsors ? sortSponsors(
    sponsors.filter((sponsor) => {
      const searchFields = [
        sponsor.name,
        sponsor.description,
        sponsor.headquarters,
        sponsor.short_description
      ].filter(Boolean);
      
      const matchesSearch = searchFields.some(field => 
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesPropertyType = selectedPropertyTypes.length === 0 || 
        (sponsor.property_types && 
          selectedPropertyTypes.some(type => sponsor.property_types?.includes(type)));

      const matchesInvestmentType = selectedInvestmentTypes.length === 0 || 
        (sponsor.investment_types && 
          selectedInvestmentTypes.some(type => sponsor.investment_types?.includes(type)));

      return matchesSearch && matchesPropertyType && matchesInvestmentType;
    })
  ) : [];

  return (
    <div className="min-h-screen flex flex-col">
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
            <p className="text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          </div>
        )}

        {!isLoading && !error && (!filteredSponsors || filteredSponsors.length === 0) && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No sponsors found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}

        {filteredSponsors && filteredSponsors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSponsors.map((sponsor) => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Sponsors;