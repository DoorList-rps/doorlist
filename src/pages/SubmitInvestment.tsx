
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { InfoIcon, UserCircle2, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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

const relationshipTypes = [
  "Sponsor",
  "Broker",
  "Placement Agent",
  "Investor Relations",
  "Other"
];

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

          {!session && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-sm text-blue-700">
                Already have an account? <Link to="/login?redirect=/submit-investment" className="font-medium text-doorlist-salmon hover:underline">Sign in</Link> to automatically fill your contact information.
              </AlertDescription>
            </Alert>
          )}

          {session && (
            <div className="mb-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
              <UserCircle2 className="h-4 w-4" />
              <span>Submitting as {session.user.email}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-100 mb-2">
              <h2 className="text-xl font-semibold text-doorlist-navy">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="submitterName">Your Name *</Label>
                  <Input 
                    id="submitterName" 
                    name="submitterName" 
                    required
                    placeholder="Enter your full name" 
                    className="bg-white"
                    defaultValue={userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submitterEmail">Your Email *</Label>
                  <Input 
                    id="submitterEmail" 
                    name="submitterEmail" 
                    type="email"
                    required
                    placeholder="Enter your email address" 
                    className="bg-white"
                    defaultValue={userProfile?.email || ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="submitterCompany">Company Name *</Label>
                  <Input 
                    id="submitterCompany" 
                    name="submitterCompany" 
                    required
                    placeholder="Enter your company name" 
                    className="bg-white"
                    defaultValue={userProfile?.company || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submitterTitle">Your Title *</Label>
                  <Input 
                    id="submitterTitle" 
                    name="submitterTitle" 
                    required
                    placeholder="Enter your job title" 
                    className="bg-white"
                    defaultValue={userProfile?.title || ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Your Relationship to the Investment *</Label>
                <Select name="relationship" required>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select your relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
