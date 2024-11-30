import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

const Sponsors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("");
  const [selectedInvestmentType, setSelectedInvestmentType] = useState<string>("");

  const { data: sponsors, isLoading, error } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*');

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

  const filteredSponsors = sponsors?.filter((sponsor) => {
    const searchFields = [
      sponsor.name,
      sponsor.description,
      sponsor.headquarters,
      sponsor.short_description
    ].filter(Boolean);
    
    const matchesSearch = searchFields.some(field => 
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesPropertyType = !selectedPropertyType || 
      (sponsor.property_types && sponsor.property_types.includes(selectedPropertyType));

    const matchesInvestmentType = !selectedInvestmentType || 
      (sponsor.investment_types && sponsor.investment_types.includes(selectedInvestmentType));

    return matchesSearch && matchesPropertyType && matchesInvestmentType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Our Sponsors</h1>
        
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search sponsors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
              >
                <option value="">All Property Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedInvestmentType}
                onChange={(e) => setSelectedInvestmentType(e.target.value)}
              >
                <option value="">All Investment Types</option>
                {investmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
              <Link 
                key={sponsor.id}
                to={`/sponsors/${sponsor.id}`}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center">
                  {sponsor.logo_url && (
                    <img
                      src={sponsor.logo_url}
                      alt={`${sponsor.name} logo`}
                      className="w-32 h-32 object-contain mb-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  )}
                  <h3 className="text-xl font-semibold text-center mb-2">
                    {sponsor.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4 text-center line-clamp-3">
                  {sponsor.short_description || 'No description available'}
                </p>

                {sponsor.headquarters && (
                  <p className="text-sm text-gray-500 text-center">
                    {sponsor.headquarters}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Sponsors;