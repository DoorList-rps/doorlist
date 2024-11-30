import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatIsDoorList from "@/components/WhatIsDoorList";
import InvestmentHighlights from "@/components/InvestmentHighlights";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <WhatIsDoorList />
      <InvestmentHighlights />
      <Footer />
    </div>
  );
};

export default Index;