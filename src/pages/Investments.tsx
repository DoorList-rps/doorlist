import { useState } from "react";
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import InvestmentFilters from "@/components/investments/InvestmentFilters";
import InvestmentHeader from "@/components/investments/InvestmentHeader";
import InvestmentList from "@/components/investments/InvestmentList";

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
        <InvestmentHeader />
        
        <div className="md:sticky md:top-20 bg-white z-10 py-4">
          <InvestmentFilters
            types={propertyTypes}
            onSearchChange={setSearchTerm}
            onTypeChange={setSelectedType}
            selectedType={selectedType}
            onReset={handleReset}
          />
        </div>

        <InvestmentList 
          investments={filteredInvestments || []}
          isLoading={isLoading}
          error={error instanceof Error ? error : null}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Investments;