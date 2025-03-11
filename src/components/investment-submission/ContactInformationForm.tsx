
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle2, InfoIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const relationshipTypes = [
  "Sponsor",
  "Broker",
  "Placement Agent",
  "Investor Relations",
  "Other"
];

interface ContactInformationFormProps {
  isLoggedIn: boolean;
  userEmail?: string | null;
  userProfile: {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    company: string | null;
    title: string | null;
  } | null;
  onSubmit: (data: ContactFormValues) => void;
}

export const contactFormSchema = z.object({
  submitterName: z.string().min(1, "Name is required"),
  submitterEmail: z.string().email("Please enter a valid email address"),
  submitterCompany: z.string().min(1, "Company name is required"),
  submitterTitle: z.string().min(1, "Title is required"),
  relationship: z.string().min(1, "Please select your relationship to the investment")
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactInformationForm = ({ isLoggedIn, userEmail, userProfile, onSubmit }: ContactInformationFormProps) => {
  // Initialize default values from user profile if available
  const defaultValues = {
    submitterName: userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : '',
    submitterEmail: userProfile?.email || '',
    submitterCompany: userProfile?.company || '',
    submitterTitle: userProfile?.title || '',
    relationship: ''
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onBlur"
  });

  const handleSubmit = (data: ContactFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-100 mb-2">
      <h2 className="text-xl font-semibold text-doorlist-navy">Contact Information</h2>
      
      {!isLoggedIn && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-blue-700">
            Already have an account? <Link to="/login?redirect=/submit-investment" className="font-medium text-doorlist-salmon hover:underline">Sign in</Link> to automatically fill your contact information.
          </AlertDescription>
        </Alert>
      )}

      {isLoggedIn && (
        <div className="mb-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
          <UserCircle2 className="h-4 w-4" />
          <span>Submitting as {userEmail}</span>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="submitterName">Your Name *</Label>
                  <FormControl>
                    <Input 
                      id="submitterName" 
                      placeholder="Enter your full name" 
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
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="submitterEmail">Your Email *</Label>
                  <FormControl>
                    <Input 
                      id="submitterEmail" 
                      type="email"
                      placeholder="Enter your email address" 
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
              name="submitterCompany"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="submitterCompany">Company Name *</Label>
                  <FormControl>
                    <Input 
                      id="submitterCompany" 
                      placeholder="Enter your company name" 
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
              name="submitterTitle"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="submitterTitle">Your Title *</Label>
                  <FormControl>
                    <Input 
                      id="submitterTitle" 
                      placeholder="Enter your job title" 
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="relationship">Your Relationship to the Investment *</Label>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select your relationship" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relationshipTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default ContactInformationForm;
