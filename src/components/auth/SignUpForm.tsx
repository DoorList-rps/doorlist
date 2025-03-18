
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SignUpFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SignUpForm = ({ isLoading, setIsLoading }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAccreditedInvestor, setIsAccreditedInvestor] = useState<string>("");
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!firstName || !lastName || !phoneNumber || !isAccreditedInvestor) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with email and password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            is_accredited_investor: isAccreditedInvestor === "true",
          },
        },
      });

      if (error) throw error;
      
      console.log('Sign up successful, preparing to send events');

      // Track signup event in Klaviyo with detailed logging
      try {
        const eventData = {
          event_name: 'New User Sign Up',
          customer_properties: {
            email: email,
            $email: email, // Adding Klaviyo's required identifier
            first_name: firstName,
            $first_name: firstName, // Adding Klaviyo's naming convention
            last_name: lastName,
            $last_name: lastName, // Adding Klaviyo's naming convention
            phone_number: phoneNumber,
            $phone_number: phoneNumber, // Adding Klaviyo's naming convention
            is_accredited_investor: isAccreditedInvestor === "true"
          },
          properties: {
            signup_method: 'email',
            platform: 'DoorList',
            source: 'website',
            timestamp: new Date().toISOString()
          }
        };
        
        console.log('Sending signup event to event tracking system with data:', JSON.stringify(eventData));
        
        const trackingResponse = await supabase.functions.invoke('klaviyo-events', {
          body: eventData
        });
        
        console.log('Event tracking response:', trackingResponse);
        
        if (trackingResponse.error) {
          console.error('Event tracking error:', trackingResponse.error);
          throw new Error(`Event tracking error: ${trackingResponse.error.message || 'Unknown error'}`);
        }
        
        console.log('Successfully sent signup event to tracking system');
      } catch (trackingError) {
        console.error('Failed to send event to tracking system:', trackingError);
        // Don't block signup if tracking fails, but log the error
      }

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="signup">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </Label>
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </Label>
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </Label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <Label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </Label>
          <Input
            id="phone-number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <Label htmlFor="accredited-investor" className="block text-sm font-medium text-gray-700 mb-1">
            Are you an accredited investor? *
          </Label>
          <Select
            value={isAccreditedInvestor}
            onValueChange={setIsAccreditedInvestor}
            required
          >
            <SelectTrigger id="accredited-investor" className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </Label>
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Choose a password"
          />
        </div>

        <Button type="submit" className="w-full bg-doorlist-navy hover:bg-doorlist-navy/90" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </TabsContent>
  );
};

export default SignUpForm;
