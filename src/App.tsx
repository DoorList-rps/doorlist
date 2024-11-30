import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Investments from "./pages/Investments";
import InvestmentDetail from "./pages/InvestmentDetail";
import Sponsors from "./pages/Sponsors";
import SponsorDetail from "./pages/SponsorDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/investments/:id" element={<InvestmentDetail />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/sponsors/:id" element={<SponsorDetail />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;