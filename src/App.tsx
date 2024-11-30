import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Investments from "./pages/Investments";
import InvestmentDetail from "./pages/InvestmentDetail";
import Sponsors from "./pages/Sponsors";
import SponsorDetail from "./pages/SponsorDetail";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclosures from "./pages/Disclosures";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investments"
            element={
              <ProtectedRoute>
                <Investments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investments/:id"
            element={
              <ProtectedRoute>
                <InvestmentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sponsors"
            element={
              <ProtectedRoute>
                <Sponsors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sponsors/:id"
            element={
              <ProtectedRoute>
                <SponsorDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <Privacy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute>
                <Terms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disclosures"
            element={
              <ProtectedRoute>
                <Disclosures />
              </ProtectedRoute>
            }
          />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;