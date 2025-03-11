
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const propertyTypes = [
  "Multifamily",
  "Single Family",
  "Office",
  "Retail",
  "Industrial",
  "Hotel/Hospitality",
  "Land",
  "Mixed Use",
  "Self Storage",
  "Senior Housing",
  "Student Housing",
  "Other"
];

const investmentTypes = [
  "Equity",
  "Debt",
  "Preferred Equity",
  "Fund",
  "REIT",
  "Syndication",
  "1031 Exchange",
  "Opportunity Zone",
  "Other"
];

interface InvestmentDetailsFormProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isRollingOffering: boolean;
  setIsRollingOffering: (isRolling: boolean) => void;
}

const InvestmentDetailsForm = ({ 
  selectedDate, 
  setSelectedDate, 
  isRollingOffering, 
  setIsRollingOffering 
}: InvestmentDetailsFormProps) => {
  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-doorlist-navy">Investment Details</h2>
    
      <div className="space-y-2">
        <Label htmlFor="name">Investment Name *</Label>
        <Input 
          id="name" 
          name="name" 
          required
          placeholder="Enter investment name" 
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description" 
          name="description" 
          required 
          className="min-h-[150px] bg-white"
          placeholder="Provide a detailed description of your investment opportunity..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="investmentUrl">Investment URL *</Label>
        <Input 
          id="investmentUrl" 
          name="investmentUrl" 
          type="url" 
          placeholder="https://..."
          required 
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type *</Label>
          <Select name="propertyType" required>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentType">Investment Type *</Label>
          <Select name="investmentType" required>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select investment type" />
            </SelectTrigger>
            <SelectContent>
              {investmentTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="holdPeriod">Hold Period *</Label>
          <Input 
            id="holdPeriod" 
            name="holdPeriod" 
            required 
            placeholder="e.g., 5 years"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distributionFrequency">Distribution Frequency *</Label>
          <Input 
            id="distributionFrequency" 
            name="distributionFrequency" 
            required 
            placeholder="e.g., Monthly, Quarterly"
            className="bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="minimumInvestment">Minimum Investment ($) *</Label>
          <Input 
            id="minimumInvestment" 
            name="minimumInvestment" 
            type="number" 
            min="0" 
            required 
            placeholder="Minimum investment amount"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetReturn">Target Return (%) *</Label>
          <Input 
            id="targetReturn" 
            name="targetReturn" 
            required 
            placeholder="e.g., 8-10%"
            className="bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="totalEquity">Target Total Raise ($) *</Label>
          <Input 
            id="totalEquity" 
            name="totalEquity" 
            type="number" 
            min="0" 
            required 
            placeholder="Target total capital raise"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accreditedOnly">Accredited Investors Only *</Label>
          <Select name="accreditedOnly" defaultValue="true">
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Closing Date *</Label>
          <div className="flex items-center space-x-2">
            <Label htmlFor="isRollingOffering" className="text-sm font-normal cursor-pointer">
              <input
                type="checkbox"
                id="isRollingOffering"
                className="mr-1"
                checked={isRollingOffering}
                onChange={(e) => setIsRollingOffering(e.target.checked)}
              />
              Rolling/Evergreen Offering
            </Label>
          </div>
        </div>
        
        {!isRollingOffering ? (
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-input",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => setSelectedDate(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <input
              type="hidden"
              name="closingDate"
              value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
            />
          </div>
        ) : (
          <div className="h-10 px-3 py-2 rounded-md border border-input bg-white text-gray-500 flex items-center">
            Rolling/Evergreen
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDetailsForm;
