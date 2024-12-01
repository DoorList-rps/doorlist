import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedPropertyTypes.length === 0
                    ? "Select property types..."
                    : `${selectedPropertyTypes.length} selected`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {propertyTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedPropertyTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPropertyTypes([...selectedPropertyTypes, type]);
                      } else {
                        setSelectedPropertyTypes(
                          selectedPropertyTypes.filter((t) => t !== type)
                        );
                      }
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedPropertyTypes.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSelectedPropertyTypes([])}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Types
          </label>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedInvestmentTypes.length === 0
                    ? "Select investment types..."
                    : `${selectedInvestmentTypes.length} selected`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {investmentTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedInvestmentTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedInvestmentTypes([...selectedInvestmentTypes, type]);
                      } else {
                        setSelectedInvestmentTypes(
                          selectedInvestmentTypes.filter((t) => t !== type)
                        );
                      }
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedInvestmentTypes.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSelectedInvestmentTypes([])}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
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