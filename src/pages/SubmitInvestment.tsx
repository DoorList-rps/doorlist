
import { Helmet } from 'react-helmet-async';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TablesInsert } from "@/integrations/supabase/types";

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

const SubmitInvestment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit an investment opportunity.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const description = formData.get('description')?.toString() || '';
      const name = formData.get('name')?.toString() || '';
      
      const submissionData = {
        user_id: session.user.id,
        name: name,
        description: description,
        short_description: description.substring(0, 200), // Create short description from main description
        minimum_investment: Number(formData.get('minimumInvestment')) || null,
        target_return: formData.get('targetReturn')?.toString(),
        property_type: formData.get('propertyType')?.toString(),
        investment_type: formData.get('investmentType')?.toString(),
        hold_period: formData.get('holdPeriod')?.toString(),
        distribution_frequency: formData.get('distributionFrequency')?.toString(),
        total_equity: Number(formData.get('totalEquity')) || null,
        equity_remaining: Number(formData.get('equityRemaining')) || null,
        accredited_only: formData.get('accreditedOnly') === 'true',
        closing_date: formData.get('closingDate')?.toString() || null,
        investment_url: formData.get('investmentUrl')?.toString(),
        status: 'pending',
        approved: false,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      const { error } = await supabase
        .from('investment_submissions')
        .insert(submissionData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your investment opportunity has been submitted for review.",
      });
      navigate("/investments");
    } catch (error) {
      console.error('Error submitting investment:', error);
      toast({
        title: "Error",
        description: "Failed to submit investment opportunity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Submit Investment Opportunity | DoorList</title>
        <meta 
          name="description" 
          content="Submit your real estate investment opportunity to DoorList for review and listing." 
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-28">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-doorlist-navy mb-2">Submit Investment Opportunity</h1>
          <p className="text-gray-600 mb-8">
            Share your real estate investment opportunity with our community. All submissions will be reviewed before being listed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Investment Name</Label>
              <Input 
                id="name" 
                name="name" 
                required
                placeholder="Enter investment name" 
                className="bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                required 
                className="min-h-[150px] bg-gray-50 focus:bg-white"
                placeholder="Provide a detailed description of your investment opportunity..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentUrl">Investment URL</Label>
              <Input 
                id="investmentUrl" 
                name="investmentUrl" 
                type="url" 
                placeholder="https://..."
                required 
                className="bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select name="propertyType" required>
                  <SelectTrigger className="bg-gray-50 focus:bg-white">
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
                <Label htmlFor="investmentType">Investment Type</Label>
                <Select name="investmentType" required>
                  <SelectTrigger className="bg-gray-50 focus:bg-white">
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
                <Label htmlFor="holdPeriod">Hold Period</Label>
                <Input 
                  id="holdPeriod" 
                  name="holdPeriod" 
                  required 
                  placeholder="e.g., 5 years"
                  className="bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributionFrequency">Distribution Frequency</Label>
                <Input 
                  id="distributionFrequency" 
                  name="distributionFrequency" 
                  required 
                  placeholder="e.g., Monthly, Quarterly"
                  className="bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minimumInvestment">Minimum Investment ($)</Label>
                <Input 
                  id="minimumInvestment" 
                  name="minimumInvestment" 
                  type="number" 
                  min="0" 
                  required 
                  placeholder="Minimum investment amount"
                  className="bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetReturn">Target Return (%)</Label>
                <Input 
                  id="targetReturn" 
                  name="targetReturn" 
                  required 
                  placeholder="e.g., 8-10%"
                  className="bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalEquity">Total Equity ($)</Label>
                <Input 
                  id="totalEquity" 
                  name="totalEquity" 
                  type="number" 
                  min="0" 
                  required 
                  placeholder="Total equity offering"
                  className="bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equityRemaining">Equity Remaining ($)</Label>
                <Input 
                  id="equityRemaining" 
                  name="equityRemaining" 
                  type="number" 
                  min="0" 
                  required 
                  placeholder="Equity currently available"
                  className="bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="accreditedOnly">Accredited Investors Only</Label>
                <Select name="accreditedOnly" defaultValue="true">
                  <SelectTrigger className="bg-gray-50 focus:bg-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingDate">Closing Date</Label>
                <Input 
                  id="closingDate" 
                  name="closingDate" 
                  type="date"
                  required 
                  className="bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-doorlist-navy hover:bg-doorlist-navy/90 text-white mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Investment Opportunity"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitInvestment;
