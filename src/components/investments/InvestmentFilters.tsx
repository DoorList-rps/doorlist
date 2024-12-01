import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { InvestmentFilters as IInvestmentFilters } from "@/types/investments";

interface InvestmentFiltersProps {
  types: string[];
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string) => void;
  selectedType: string;
}

const InvestmentFilters = ({ types, onSearchChange, onTypeChange, selectedType }: InvestmentFiltersProps) => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Parse filters from URL
  useEffect(() => {
    const filtersParam = searchParams.get('filters');
    if (filtersParam) {
      try {
        const filters = JSON.parse(decodeURIComponent(filtersParam)) as IInvestmentFilters;
        if (filters.property_type) {
          onTypeChange(filters.property_type);
        }
      } catch (error) {
        console.error('Error parsing filters:', error);
      }
    }
  }, [searchParams, onTypeChange]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search investments..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedType === "" ? "default" : "outline"}
          onClick={() => onTypeChange("")}
          className="whitespace-nowrap"
        >
          All Types
        </Button>
        {types.map((type) => type && (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => onTypeChange(type)}
            className="whitespace-nowrap"
          >
            {type}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default InvestmentFilters;