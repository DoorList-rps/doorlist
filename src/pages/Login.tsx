import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import SocialAuth from "@/components/auth/SocialAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAuthStateChange = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const redirect = searchParams.get('redirect') || '/profile';
        const action = searchParams.get('action');
        
        let message = "Successfully signed in!";
        if (action === 'request_introduction') {
          message = "You can now request the sponsor introduction.";
        } else if (action === 'request_details') {
          message = "You can now request the investment details.";
        }
        
        toast({
          title: "Welcome!",
          description: message,
        });
        
        navigate(redirect);
      }
    };

    handleAuthStateChange();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      handleAuthStateChange();
    });

    return () => subscription.unsubscribe();
  }, [navigate, searchParams, toast]);

  return (
    <AuthLayout>
      <Helmet>
        <title>Sign In | DoorList</title>
        <meta 
          name="description" 
          content="Sign in to your DoorList account to access exclusive real estate investment opportunities and manage your portfolio." 
        />
      </Helmet>
      
      <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
      <SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
      <SocialAuth />
    </AuthLayout>
  );
};

export default Login;