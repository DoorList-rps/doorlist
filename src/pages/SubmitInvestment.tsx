
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
      const investmentData: TablesInsert<'investments'> = {
        name: formData.get('name')?.toString() || '',
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
        location_city: formData.get('city')?.toString(),
        location_state: formData.get('state')?.toString(),
        accredited_only: formData.get('accreditedOnly') === 'true',
        closing_date: formData.get('closingDate')?.toString() || null,
        investment_url: formData.get('investmentUrl')?.toString(),
        approved: false,
        slug: formData.get('name')?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
      };

      const { error } = await supabase
        .from('investments')
        .insert(investmentData);

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
    <div className="min-h-screen">
      <Helmet>
        <title>Submit Investment Opportunity | DoorList</title>
        <meta 
          name="description" 
          content="Submit your real estate investment opportunity to DoorList for review and listing." 
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-4">Submit Investment Opportunity</h1>
        <p className="text-gray-600 mb-8">
          Share your real estate investment opportunity with our community. All submissions will be reviewed before being listed.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Investment Name</Label>
            <Input id="name" name="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              required 
              className="min-h-[150px]"
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Input id="propertyType" name="propertyType" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentType">Investment Type</Label>
              <Input id="investmentType" name="investmentType" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="holdPeriod">Hold Period</Label>
              <Input id="holdPeriod" name="holdPeriod" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distributionFrequency">Distribution Frequency</Label>
              <Input id="distributionFrequency" name="distributionFrequency" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimumInvestment">Minimum Investment ($)</Label>
              <Input 
                id="minimumInvestment" 
                name="minimumInvestment" 
                type="number" 
                min="0" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetReturn">Target Return (%)</Label>
              <Input 
                id="targetReturn" 
                name="targetReturn" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalEquity">Total Equity ($)</Label>
              <Input 
                id="totalEquity" 
                name="totalEquity" 
                type="number" 
                min="0" 
                required 
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accreditedOnly">Accredited Investors Only</Label>
              <Select name="accreditedOnly" defaultValue="true">
                <SelectTrigger>
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
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Investment"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitInvestment;
