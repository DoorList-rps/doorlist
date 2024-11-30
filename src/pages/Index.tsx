import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InvestmentHighlights from "@/components/InvestmentHighlights";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <InvestmentHighlights />
      <Footer />
    </div>
  );
};

export default Index;