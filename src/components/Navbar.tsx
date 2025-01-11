import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/login");
    }
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2" aria-label="Return to Homepage">
            <img 
              src="/lovable-uploads/d1f54f8f-4675-4969-8b15-20412e122947.png" 
              alt="DoorList Logo" 
              className="h-8 w-auto brightness-0"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-doorlist-navy hover:text-doorlist-salmon transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/investments" 
              className="text-doorlist-navy hover:text-doorlist-salmon transition-colors font-medium"
            >
              Investments
            </Link>
            <Link 
              to="/sponsors" 
              className="text-doorlist-navy hover:text-doorlist-salmon transition-colors font-medium"
            >
              Sponsors
            </Link>
            <Link 
              to="/education" 
              className="text-doorlist-navy hover:text-doorlist-salmon transition-colors font-medium"
            >
              Education
            </Link>
            <Link 
              to="/about" 
              className="text-doorlist-navy hover:text-doorlist-salmon transition-colors font-medium"
            >
              About
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-doorlist-navy hover:text-doorlist-salmon transition-colors font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2.5 bg-doorlist-salmon text-white rounded-full hover:bg-opacity-90 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-doorlist-salmon text-white rounded-full hover:bg-opacity-90 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;