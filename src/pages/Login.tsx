import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting you to your profile.",
      });

      navigate("/profile");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Sign In | DoorList</title>
        <meta name="description" content="Sign in to your DoorList account to access exclusive real estate investment opportunities and manage your portfolio." />
      </Helmet>
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-4">Sign In</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
              />
            </div>
            <Button type="submit" className="w-full bg-doorlist-navy hover:bg-doorlist-navy/90" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
