import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalculatorProvider } from "@/components/calculator/CalculatorContext";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import InvestmentValueChart from "@/components/calculator/InvestmentValueChart";
import DividendsChart from "@/components/calculator/DividendsChart";

const Calculator = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Investment Calculator | DoorList</title>
        <meta 
          name="description" 
          content="Plan your investment strategy with DoorList's comprehensive investment calculator. Estimate returns, analyze growth potential, and make informed decisions." 
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-6">Investment Calculator</h1>
          <p className="text-lg text-gray-600 mb-8">
            Use our calculator to estimate potential returns on your investments over time. 
            Adjust variables like initial investment, monthly contributions, and expected returns 
            to see how your investment could grow.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <CalculatorProvider>
              <div>
                <CalculatorForm />
              </div>
              <div className="space-y-6">
                <InvestmentValueChart />
                <DividendsChart />
              </div>
            </CalculatorProvider>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;