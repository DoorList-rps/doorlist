import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatIsDoorList from "@/components/WhatIsDoorList";
import InvestmentHighlights from "@/components/InvestmentHighlights";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>DoorList | Real Estate Investment Opportunities</title>
        <meta name="description" content="Discover curated real estate investment opportunities from top sponsors. Access institutional-quality deals with lower minimums." />
      </Helmet>
      <Navbar />
      <Hero />
      <WhatIsDoorList />
      <InvestmentHighlights />
      <Footer />
    </div>
  );
};

export default Index;