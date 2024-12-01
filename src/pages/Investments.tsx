import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestmentFilters from "@/components/investments/InvestmentFilters";
import InvestmentCard from "@/components/investments/InvestmentCard";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { InvestmentFilters as IInvestmentFilters } from "@/types/investments";

const Investments = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: investments, isLoading, error } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      console.log('Starting investments fetch...');
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors (
            name,
            logo_url
          )
        `);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Investments found:', data?.length);
      return data as (Tables<'investments'> & { sponsors: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> })[];
    }
  });

  const types = investments 
    ? Array.from(new Set(investments.map(i => i.property_type).filter(Boolean)))
    : [];

  const filteredInvestments = investments?.filter((investment) => {
    const matchesSearch = (
      investment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.location_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.location_state?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get filters from URL
    const filtersParam = searchParams.get('filters');
    let urlFilters: IInvestmentFilters = {};
    if (filtersParam) {
      try {
        urlFilters = JSON.parse(decodeURIComponent(filtersParam));
      } catch (error) {
        console.error('Error parsing filters:', error);
      }
    }

    // Apply URL filters
    const matchesPropertyType = !urlFilters.property_type || investment.property_type === urlFilters.property_type;
    const matchesState = !urlFilters.location_state || investment.location_state === urlFilters.location_state;
    const matchesInvestmentType = !urlFilters.investment_type || investment.investment_type === urlFilters.investment_type;
    
    // Handle minimum investment range filters
    const matchesMinInvestment = (
      !urlFilters.minimum_investment_min || 
      (investment.minimum_investment && investment.minimum_investment >= urlFilters.minimum_investment_min)
    ) && (
      !urlFilters.minimum_investment_max || 
      (investment.minimum_investment && investment.minimum_investment <= urlFilters.minimum_investment_max)
    );

    // Combine all filter conditions
    const matchesUrlFilters = matchesPropertyType && matchesState && matchesInvestmentType && matchesMinInvestment;

    // If there's a selected type from the UI, also apply that
    const matchesSelectedType = !selectedType || investment.property_type === selectedType;

    return matchesSearch && matchesUrlFilters && matchesSelectedType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Investment Opportunities</h1>
        
        <InvestmentFilters
          types={types}
          onSearchChange={setSearchTerm}
          onTypeChange={setSelectedType}
          selectedType={selectedType}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments?.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Investments;