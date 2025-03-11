
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
import ContactInformationForm, { ContactFormValues } from "@/components/investment-submission/ContactInformationForm";
import InvestmentDetailsForm, { InvestmentFormValues } from "@/components/investment-submission/InvestmentDetailsForm";

const SubmitInvestment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isRollingOffering, setIsRollingOffering] = useState(false);
  const [contactFormData, setContactFormData] = useState<ContactFormValues | null>(null);
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

  const handleContactFormSubmit = (data: ContactFormValues) => {
    setContactFormData(data);
  };

  const handleInvestmentFormSubmit = async (data: InvestmentFormValues) => {
    if (!contactFormData) {
      toast({
        title: "Error",
        description: "Please complete the contact information first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Determine closing date based on selection
      let closingDate = null;
      if (!isRollingOffering && data.closingDate) {
        closingDate = format(data.closingDate, 'yyyy-MM-dd');
      }

      const submissionData = {
        user_id: session?.user?.id || null,
        name: data.name,
        description: data.description,
        short_description: data.description.substring(0, 200), // Create short description from main description
        minimum_investment: data.minimumInvestment,
        target_return: data.targetReturn,
        property_type: data.propertyType,
        investment_type: data.investmentType,
        hold_period: data.holdPeriod,
        distribution_frequency: data.distributionFrequency,
        total_equity: data.totalEquity,
        accredited_only: data.accreditedOnly === 'true',
        closing_date: closingDate,
        investment_url: data.investmentUrl,
        submitter_name: contactFormData.submitterName,
        submitter_email: contactFormData.submitterEmail,
        submitter_company: contactFormData.submitterCompany,
        submitter_title: contactFormData.submitterTitle,
        submitter_relationship: contactFormData.relationship,
        status: 'pending',
        approved: false,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This form is now just a container for the two sub-forms
    // The actual submission happens in handleInvestmentFormSubmit
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
              onSubmit={handleContactFormSubmit}
            />

            <InvestmentDetailsForm
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isRollingOffering={isRollingOffering}
              setIsRollingOffering={setIsRollingOffering}
              onSubmit={handleInvestmentFormSubmit}
            />

            <Button 
              type="submit" 
              className="w-full bg-doorlist-navy hover:bg-doorlist-navy/90 text-white mt-6"
              disabled={isSubmitting}
              onClick={() => {
                // Trigger form submission through clicking the hidden submit buttons
                document.querySelectorAll('form').forEach(form => {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                });
              }}
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
