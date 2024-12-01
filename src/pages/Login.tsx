import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const action = searchParams.get('action');
  const investmentId = searchParams.get('investment_id');

  useEffect(() => {
    const handlePostLoginAction = async (userId: string) => {
      if (action === 'request_details' && investmentId) {
        try {
          const { error } = await supabase
            .from('investment_inquiries')
            .insert([
              { 
                investment_id: investmentId,
                user_id: userId,
              }
            ]);

          if (error) throw error;

          toast({
            title: "Request Submitted",
            description: "We'll connect you with the sponsor shortly.",
          });
        } catch (error) {
          console.error('Error submitting inquiry:', error);
          toast({
            title: "Request Failed",
            description: "Unable to submit your request. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        if (session?.user?.id) {
          handlePostLoginAction(session.user.id);
        }
        toast({
          title: "Success",
          description: "You have successfully signed in.",
        });
        navigate(redirect || "/");
      }
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });
  }, [navigate, toast, redirect, action, investmentId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-doorlist-navy">Welcome to DoorList</h1>
          <p className="text-gray-600 mt-2">
            Sign in to access exclusive investment opportunities
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1e3a8a',
                  brandAccent: '#152454',
                }
              }
            }
          }}
          providers={["google"]}
          redirectTo={`${window.location.origin}/`}
        />
      </div>
    </div>
  );
};

export default Login;