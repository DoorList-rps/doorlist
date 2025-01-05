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
      const { error } = await supabase
        .from('investments')
        .insert([
          {
            name: formData.get('name'),
            description: formData.get('description'),
            short_description: formData.get('shortDescription'),
            minimum_investment: formData.get('minimumInvestment'),
            target_return: formData.get('targetReturn'),
            property_type: formData.get('propertyType'),
            location_city: formData.get('city'),
            location_state: formData.get('state'),
            approved: false,
            slug: formData.get('name')?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          }
        ]);

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
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input id="shortDescription" name="shortDescription" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea id="description" name="description" required />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Input 
              id="propertyType" 
              name="propertyType" 
              required 
            />
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