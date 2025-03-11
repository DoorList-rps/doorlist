
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ContactInformationForm from "@/components/investment-submission/ContactInformationForm";
import InvestmentDetailsForm from "@/components/investment-submission/InvestmentDetailsForm";

const SubmitInvestment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isRollingOffering, setIsRollingOffering] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    company: string | null;
    title: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user) {
        try {
          // Get user email from session
          const email = session.user.email;

          // Get additional profile data if available
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
          }

          setUserProfile({
            email,
            first_name: profileData?.first_name || '',
            last_name: profileData?.last_name || '',
            company: '', // These fields don't exist in the profiles table
            title: '',   // These fields don't exist in the profiles table
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const description = formData.get('description')?.toString() || '';
      const name = formData.get('name')?.toString() || '';
      const submitterName = formData.get('submitterName')?.toString() || '';
      const submitterEmail = formData.get('submitterEmail')?.toString() || '';
      const submitterCompany = formData.get('submitterCompany')?.toString() || '';
      const submitterTitle = formData.get('submitterTitle')?.toString() || '';
      const relationship = formData.get('relationship')?.toString() || '';
      
      // Determine closing date based on selection
      let closingDate = null;
      if (!isRollingOffering && selectedDate) {
        closingDate = format(selectedDate, 'yyyy-MM-dd');
      }

      const submissionData = {
        user_id: session?.user?.id || null,
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
        accredited_only: formData.get('accreditedOnly') === 'true',
        closing_date: closingDate,
        investment_url: formData.get('investmentUrl')?.toString(),
        submitter_name: submitterName,
        submitter_email: submitterEmail,
        submitter_company: submitterCompany,
        submitter_title: submitterTitle,
        submitter_relationship: relationship,
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
            <ContactInformationForm 
              isLoggedIn={!!session}
              userEmail={session?.user?.email}
              userProfile={userProfile}
            />

            <InvestmentDetailsForm
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isRollingOffering={isRollingOffering}
              setIsRollingOffering={setIsRollingOffering}
            />

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
