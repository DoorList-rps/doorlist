import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import InvestmentValueChart from "@/components/calculator/InvestmentValueChart";
import DividendsChart from "@/components/calculator/DividendsChart";
import Footer from "@/components/Footer";
import { CalculatorProvider } from "@/components/calculator/CalculatorContext";

const Calculator = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Investment Calculator</h1>
          <p className="text-gray-600 mb-8">
            Use our calculator to estimate potential returns on your real estate investments.
            Adjust the parameters below to see how different scenarios might affect your investment outcomes.
          </p>

          <CalculatorProvider>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="p-6">
                <CalculatorForm />
              </Card>
              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Investment Value Over Time</h3>
                  <InvestmentValueChart />
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Projected Dividends</h3>
                  <DividendsChart />
                </Card>
              </div>
            </div>
          </CalculatorProvider>

          <div className="text-center bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Investing with DoorList?</h2>
            <p className="text-gray-600 mb-6">
              Explore our curated list of investment opportunities and find the perfect match for your investment goals.
            </p>
            <Button asChild size="lg">
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