
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

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
  "Mezzanine Debt",
  "Preferred Equity",
  "Other"
];

const investmentVehicles = [
  "Evergreen Fund",
  "Closed-Ended Fund",
  "Syndication",
  "Individual Property",
  "DST",
  "Opportunity Zone Fund",
  "REIT",
  "Other"
];

export const investmentFormSchema = z.object({
  name: z.string().min(1, "Investment name is required"),
  description: z.string().min(20, "Please provide a detailed description (minimum 20 characters)"),
  investmentUrl: z.string().url("Please enter a valid URL"),
  propertyType: z.string().min(1, "Property type is required"),
  investmentType: z.string().min(1, "Investment type is required"),
  investmentVehicle: z.string().min(1, "Investment vehicle is required"),
  holdPeriod: z.string().min(1, "Hold period is required"),
  distributionFrequency: z.string().min(1, "Distribution frequency is required"),
  minimumInvestment: z.coerce.number().min(1, "Minimum investment must be greater than 0"),
  targetReturn: z.string().min(1, "Target return is required"),
  totalEquity: z.coerce.number().min(1, "Target total raise must be greater than 0"),
  accreditedOnly: z.enum(["true", "false"]),
  isRollingOffering: z.boolean().default(false),
  closingDate: z.date().optional().nullable()
});

export type InvestmentFormValues = z.infer<typeof investmentFormSchema>;

interface InvestmentDetailsFormProps {
  onSubmit: (data: InvestmentFormValues) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isRollingOffering: boolean;
  setIsRollingOffering: (isRolling: boolean) => void;
}

const InvestmentDetailsForm = ({ 
  onSubmit,
  selectedDate, 
  setSelectedDate, 
  isRollingOffering, 
  setIsRollingOffering 
}: InvestmentDetailsFormProps) => {
  
  const defaultValues: InvestmentFormValues = {
    name: "",
    description: "",
    investmentUrl: "",
    propertyType: "",
    investmentType: "",
    investmentVehicle: "",
    holdPeriod: "",
    distributionFrequency: "",
    minimumInvestment: 0,
    targetReturn: "",
    totalEquity: 0,
    accreditedOnly: "true", // Changed from string to literal "true"
    isRollingOffering: false,
    closingDate: null
  };

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues,
    mode: "onBlur"
  });

  const handleSubmit = (data: InvestmentFormValues) => {
    // If it's a rolling offering, closingDate should be null
    if (isRollingOffering) {
      data.closingDate = null;
    } else {
      data.closingDate = selectedDate;
    }
    
    onSubmit(data);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-doorlist-navy">Investment Details</h2>
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name">Investment Name *</Label>
                <FormControl>
                  <Input 
                    id="name" 
                    placeholder="Enter investment name" 
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="description">Description *</Label>
                <FormControl>
                  <Textarea 
                    id="description" 
                    className="min-h-[150px] bg-white"
                    placeholder="Provide a detailed description of your investment opportunity..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investmentUrl"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="investmentUrl">Investment URL *</Label>
                <FormControl>
                  <Input 
                    id="investmentUrl" 
                    type="url" 
                    placeholder="https://..."
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="investmentType"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="investmentType">Investment Type *</Label>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select investment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {investmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="investmentVehicle"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="investmentVehicle">Investment Vehicle *</Label>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select investment vehicle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {investmentVehicles.map((vehicle) => (
                      <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="holdPeriod"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="holdPeriod">Hold Period *</Label>
                  <FormControl>
                    <Input 
                      id="holdPeriod" 
                      placeholder="e.g., 5 years"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distributionFrequency"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="distributionFrequency">Distribution Frequency *</Label>
                  <FormControl>
                    <Input 
                      id="distributionFrequency" 
                      placeholder="e.g., Monthly, Quarterly"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="minimumInvestment"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="minimumInvestment">Minimum Investment ($) *</Label>
                  <FormControl>
                    <Input 
                      id="minimumInvestment" 
                      type="number" 
                      min="0" 
                      placeholder="Minimum investment amount"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetReturn"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="targetReturn">Target Return (%) *</Label>
                  <FormControl>
                    <Input 
                      id="targetReturn" 
                      placeholder="e.g., 8-10%"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="totalEquity"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="totalEquity">Target Total Raise ($) *</Label>
                  <FormControl>
                    <Input 
                      id="totalEquity" 
                      type="number" 
                      min="0" 
                      placeholder="Target total capital raise"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accreditedOnly"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="accreditedOnly">Accredited Investors Only *</Label>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    onChange={(e) => {
                      setIsRollingOffering(e.target.checked);
                      form.setValue("isRollingOffering", e.target.checked);
                    }}
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
                      onSelect={(date) => {
                        setSelectedDate(date);
                        form.setValue("closingDate", date);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-white text-gray-500 flex items-center">
                Rolling/Evergreen
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvestmentDetailsForm;
