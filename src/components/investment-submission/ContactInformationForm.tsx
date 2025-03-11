
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
}

const ContactInformationForm = ({ isLoggedIn, userEmail, userProfile }: ContactInformationFormProps) => {
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
  );
};

export default ContactInformationForm;
