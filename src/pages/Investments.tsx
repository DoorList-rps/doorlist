import { useState } from "react";
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import InvestmentCard from "@/components/investments/InvestmentCard";
import InvestmentFilters from "@/components/investments/InvestmentFilters";
import type { Tables } from "@/integrations/supabase/types";

const Investments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const { data: investments, isLoading, error } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors (
            name,
            logo_url
          )
        `)
        .eq('approved', true);

      if (error) throw error;
      return data;
    }
  });

  // Extract unique property types
  const propertyTypes = investments
    ? Array.from(new Set(investments.map(inv => inv.property_type).filter(Boolean)))
    : [];

  // Filter investments based on search term and selected type
  const filteredInvestments = investments?.filter(investment => {
    const matchesSearch = searchTerm === "" || 
      [investment.name, investment.description, investment.short_description]
        .filter(Boolean)
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === "" || investment.property_type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleReset = () => {
    setSearchTerm("");
    setSelectedType("");
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Real Estate Investment Opportunities | DoorList</title>
        <meta 
          name="description" 
          content="Browse our curated selection of institutional-quality real estate investment opportunities from top sponsors." 
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Investment Opportunities</h1>
        
        <InvestmentFilters
          types={propertyTypes}
          onSearchChange={setSearchTerm}
          onTypeChange={setSelectedType}
          selectedType={selectedType}
          onReset={handleReset}
        />

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

        {!isLoading && !error && (!filteredInvestments || filteredInvestments.length === 0) && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No investments found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}

        {filteredInvestments && filteredInvestments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestments.map((investment) => (
              <InvestmentCard 
                key={investment.id} 
                investment={investment as Tables<'investments'> & { 
                  sponsors: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> 
                }}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Investments;