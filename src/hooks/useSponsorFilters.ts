import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";
import type { SortOption } from "@/components/sponsors/types";
import { sortSponsors } from "@/utils/sponsorSort";

export const useSponsorFilters = (sponsors: Tables<'sponsors'>[] | null) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedInvestmentTypes, setSelectedInvestmentTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const propertyTypes = sponsors
    ? Array.from(new Set(sponsors.flatMap(s => s.property_types || [])))
    : [];
  
  const investmentTypes = sponsors
    ? Array.from(new Set(sponsors.flatMap(s => s.investment_types || [])))
    : [];

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
    }), 
    sortBy
  ) : [];

  return {
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
  };
};