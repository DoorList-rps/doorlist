import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SocialAuth = () => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login process...');
      console.log('Current origin:', window.location.origin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google login error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // Specific error handling for common cases
        if (error.message.includes('connection refused')) {
          toast({
            title: "Connection Error",
            description: "Unable to connect to authentication service. Please check your network connection and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        throw error;
      }

      console.log('Google OAuth response:', data);
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error 
          ? `Authentication failed: ${error.message}`
          : "An unexpected error occurred during Google login.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="w-4 h-4 mr-2"
        />
        Google
      </Button>
    </>
  );
};

export default SocialAuth;