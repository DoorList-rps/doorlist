import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") {
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
      navigate("/");
    }
    if (event === "SIGNED_OUT") {
      navigate("/login");
    }
  });

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
          onError={(error) => {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }}
        />
      </div>
    </div>
  );
};

export default Login;