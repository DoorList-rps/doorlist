import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import InvestmentValueChart from "@/components/calculator/InvestmentValueChart";
import DividendsChart from "@/components/calculator/DividendsChart";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CalculatorProvider } from "@/components/calculator/CalculatorContext";

const Calculator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-doorlist-navy mb-6">Investment Calculator</h1>
          <p className="text-gray-600 mb-8">
            Use our calculator to estimate potential returns on your real estate investments.
            Adjust the parameters below to see how different scenarios might affect your investment outcomes.
          </p>

          <CalculatorProvider>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6 border-doorlist-navy/10">
                <CalculatorForm />
              </Card>
              <div className="space-y-8">
                <Card className="p-6 border-doorlist-navy/10">
                  <h3 className="text-lg font-semibold text-doorlist-navy mb-4">Investment Value Over Time</h3>
                  <InvestmentValueChart />
                </Card>
                <Card className="p-6 border-doorlist-navy/10">
                  <h3 className="text-lg font-semibold text-doorlist-navy mb-4">Projected Dividends</h3>
                  <DividendsChart />
                </Card>
              </div>
            </div>
          </CalculatorProvider>

          <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-doorlist-navy/10">
            <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Ready to Start Investing with DoorList?</h2>
            <p className="text-gray-600 mb-6">
              Explore our curated list of investment opportunities and find the perfect match for your investment goals.
            </p>
            <Button 
              asChild 
              className="bg-doorlist-salmon hover:bg-doorlist-salmon/90 text-white"
            >
              <a href="/investments">View Investment Opportunities</a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;