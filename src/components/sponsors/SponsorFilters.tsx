import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "./types";

interface SponsorFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedPropertyTypes: string[];
  setSelectedPropertyTypes: (value: string[]) => void;
  selectedInvestmentTypes: string[];
  setSelectedInvestmentTypes: (value: string[]) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  propertyTypes: string[];
  investmentTypes: string[];
}

const SponsorFilters = ({
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
}: SponsorFiltersProps) => {
  return (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Types
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={selectedPropertyTypes}
            multiple
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedPropertyTypes(options);
            }}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Types
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={selectedInvestmentTypes}
            multiple
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedInvestmentTypes(options);
            }}
          >
            {investmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="nameAsc">Name (A to Z)</SelectItem>
              <SelectItem value="nameDesc">Name (Z to A)</SelectItem>
              <SelectItem value="returnsDesc">Highest Returns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SponsorFilters;